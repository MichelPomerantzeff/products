import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	categories: defineTable({
		userId: v.string(),
		slug: v.string(),
		label: v.string(),
		iconName: v.string(),
		count: v.number(),
	}).index("by_user", ["userId"]),

	products: defineTable({
		categoryId: v.id("categories"),
		name: v.string(),
		url: v.string(),
		source: v.string(),
		currentPrice: v.number(),
		previousPrice: v.optional(v.number()),
		imageUrl: v.optional(v.string()),
		description: v.optional(v.string()),
		features: v.optional(v.array(v.string())),
		availability: v.optional(
			v.union(
				v.literal("in_stock"),
				v.literal("out_of_stock"),
				v.literal("preorder"),
			),
		),
	}).index("by_category", ["categoryId"]),
});
