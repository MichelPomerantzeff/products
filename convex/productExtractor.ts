"use node";

import Firecrawl from "@mendable/firecrawl-js";
import { v } from "convex/values";
import { action, env } from "./_generated/server";

const availabilityValidator = v.union(
	v.literal("in_stock"),
	v.literal("out_of_stock"),
	v.literal("preorder"),
);

const extractSchema = {
	type: "object",
	properties: {
		name: { type: "string", description: "Product name/title" },
		currentPrice: {
			type: "number",
			description: "Current price as a plain number, no currency symbol",
		},
		previousPrice: {
			type: "number",
			description:
				"Original/list price if the product is discounted, otherwise omit",
		},
		imageUrl: { type: "string", description: "Main product image URL" },
		description: { type: "string", description: "Short product description" },
		features: {
			type: "array",
			items: { type: "string" },
			description: "Key product features or specs",
		},
		availability: {
			type: "string",
			enum: ["in_stock", "out_of_stock", "preorder"],
			description: "Stock availability",
		},
	},
	required: ["name"],
};

function coerceString(value: unknown): string | undefined {
	return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function coerceNumber(value: unknown): number | undefined {
	return typeof value === "number" && Number.isFinite(value)
		? value
		: undefined;
}

function coerceFeatures(value: unknown): string[] | undefined {
	if (!Array.isArray(value)) return undefined;
	const features = value.filter(
		(item): item is string => typeof item === "string" && item.trim() !== "",
	);
	return features.length > 0 ? features : undefined;
}

function coerceAvailability(
	value: unknown,
): "in_stock" | "out_of_stock" | "preorder" | undefined {
	return value === "in_stock" ||
		value === "out_of_stock" ||
		value === "preorder"
		? value
		: undefined;
}

export const extract = action({
	args: {
		url: v.string(),
	},
	returns: v.object({
		name: v.optional(v.string()),
		currentPrice: v.optional(v.number()),
		previousPrice: v.optional(v.number()),
		imageUrl: v.optional(v.string()),
		description: v.optional(v.string()),
		features: v.optional(v.array(v.string())),
		availability: v.optional(availabilityValidator),
	}),
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error("Not authenticated");

		try {
			new URL(args.url);
		} catch {
			throw new Error("Invalid URL");
		}

		if (!env.FIRECRAWL_API_KEY) {
			throw new Error("Firecrawl is not configured");
		}

		const firecrawl = new Firecrawl({ apiKey: env.FIRECRAWL_API_KEY });

		let json: unknown;
		try {
			const doc = await firecrawl.scrape(args.url, {
				formats: [{ type: "json", schema: extractSchema }],
			});
			json = doc.json;
		} catch {
			throw new Error("Could not extract data from this page");
		}

		if (!json || typeof json !== "object") {
			throw new Error("Could not extract data from this page");
		}

		const data = json as Record<string, unknown>;

		return {
			name: coerceString(data.name),
			currentPrice: coerceNumber(data.currentPrice),
			previousPrice: coerceNumber(data.previousPrice),
			imageUrl: coerceString(data.imageUrl),
			description: coerceString(data.description),
			features: coerceFeatures(data.features),
			availability: coerceAvailability(data.availability),
		};
	},
});
