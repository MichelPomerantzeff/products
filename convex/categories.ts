import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
