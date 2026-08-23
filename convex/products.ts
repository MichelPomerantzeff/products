import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { type MutationCtx, mutation, query } from "./_generated/server";
import { requireOwnedCategory } from "./categories";

const availabilityValidator = v.union(
	v.literal("in_stock"),
	v.literal("out_of_stock"),
	v.literal("preorder"),
);

const productFields = {
	name: v.string(),
	url: v.string(),
	source: v.string(),
	currentPrice: v.number(),
	previousPrice: v.optional(v.number()),
	imageUrl: v.optional(v.string()),
	description: v.optional(v.string()),
	features: v.optional(v.array(v.string())),
	availability: v.optional(availabilityValidator),
};

export const list = query({
	args: {
		categoryId: v.id("categories"),
	},
	handler: async (ctx, { categoryId }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		const category = await ctx.db.get(categoryId);
		if (!category || category.userId !== identity.subject) return [];

		return ctx.db
			.query("products")
			.withIndex("by_category", (q) => q.eq("categoryId", categoryId))
			.take(500);
	},
});

export const create = mutation({
	args: {
		categoryId: v.id("categories"),
		...productFields,
	},
	handler: async (ctx, { categoryId, ...fields }) => {
		const category = await requireOwnedCategory(ctx, categoryId);

		await ctx.db.insert("products", { categoryId, ...fields });
		await ctx.db.patch("categories", categoryId, {
			count: category.count + 1,
		});
	},
});

async function requireOwnedProduct(ctx: MutationCtx, id: Id<"products">) {
	const product = await ctx.db.get(id);
	if (!product) throw new Error("Product not found");

	const category = await requireOwnedCategory(ctx, product.categoryId);

	return { product, category };
}

export const update = mutation({
	args: {
		id: v.id("products"),
		...productFields,
	},
	handler: async (ctx, { id, ...fields }) => {
		await requireOwnedProduct(ctx, id);
		await ctx.db.patch("products", id, fields);
	},
});

export const remove = mutation({
	args: {
		id: v.id("products"),
	},
	handler: async (ctx, { id }) => {
		const { product, category } = await requireOwnedProduct(ctx, id);

		await ctx.db.delete("products", id);
		await ctx.db.patch("categories", product.categoryId, {
			count: Math.max(0, category.count - 1),
		});
	},
});

export async function deleteProductsForCategory(
	ctx: MutationCtx,
	categoryId: Id<"categories">,
) {
	let batch = await ctx.db
		.query("products")
		.withIndex("by_category", (q) => q.eq("categoryId", categoryId))
		.take(100);

	while (batch.length > 0) {
		for (const product of batch) {
			await ctx.db.delete("products", product._id);
		}

		if (batch.length < 100) break;

		batch = await ctx.db
			.query("products")
			.withIndex("by_category", (q) => q.eq("categoryId", categoryId))
			.take(100);
	}
}
