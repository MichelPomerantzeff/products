import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, type QueryCtx, query } from "./_generated/server";
import { deleteProductsForCategory } from "./products";

function slugify(label: string) {
	return label
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export const list = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return [];

		return ctx.db
			.query("categories")
			.withIndex("by_user", (q) => q.eq("userId", identity.subject))
			.collect();
	},
});

export const create = mutation({
	args: {
		label: v.string(),
		iconName: v.string(),
	},
	handler: async (ctx, { label, iconName }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");

		const trimmedLabel = label.trim();
		if (!trimmedLabel) throw new Error("Label is required");

		await ctx.db.insert("categories", {
			userId: identity.subject,
			slug: slugify(trimmedLabel),
			label: trimmedLabel,
			iconName,
			count: 0,
		});
	},
});

export async function requireOwnedCategory(
	ctx: QueryCtx,
	id: Id<"categories">,
) {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) throw new Error("Not authenticated");

	const category = await ctx.db.get(id);
	if (!category || category.userId !== identity.subject) {
		throw new Error("Category not found");
	}

	return category;
}

export const update = mutation({
	args: {
		id: v.id("categories"),
		label: v.string(),
		iconName: v.string(),
	},
	handler: async (ctx, { id, label, iconName }) => {
		await requireOwnedCategory(ctx, id);

		const trimmedLabel = label.trim();
		if (!trimmedLabel) throw new Error("Label is required");

		const slug = slugify(trimmedLabel);
		await ctx.db.patch(id, { slug, label: trimmedLabel, iconName });

		return slug;
	},
});

export const remove = mutation({
	args: {
		id: v.id("categories"),
	},
	handler: async (ctx, { id }) => {
		await requireOwnedCategory(ctx, id);
		await deleteProductsForCategory(ctx, id);
		await ctx.db.delete(id);
	},
});
