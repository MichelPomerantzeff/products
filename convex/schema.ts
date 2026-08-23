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
});
