import { useMutation, useQuery } from "convex/react";
import { useCallback, useMemo } from "react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export type Availability = "in_stock" | "out_of_stock" | "preorder";

export type Product = {
	id: Id<"products">;
	categoryId: Id<"categories">;
	name: string;
	url: string;
	source: string;
	currentPrice: number;
	previousPrice?: number;
	imageUrl?: string;
	description?: string;
	features?: string[];
	availability?: Availability;
};

export type ProductInput = Omit<Product, "id" | "categoryId">;

export function useProducts(categoryId: Id<"categories"> | undefined) {
	const rawProducts = useQuery(
		api.products.list,
		categoryId ? { categoryId } : "skip",
	);
	const isLoading = rawProducts === undefined;
	const createProduct = useMutation(api.products.create);
	const patchProduct = useMutation(api.products.update);
	const deleteProduct = useMutation(api.products.remove);

	const products = useMemo<Product[]>(
		() =>
			(rawProducts ?? []).map((product) => ({
				id: product._id,
				categoryId: product.categoryId,
				name: product.name,
				url: product.url,
				source: product.source,
				currentPrice: product.currentPrice,
				previousPrice: product.previousPrice,
				imageUrl: product.imageUrl,
				description: product.description,
				features: product.features,
				availability: product.availability,
			})),
		[rawProducts],
	);

	const addProduct = useCallback(
		(input: ProductInput) => {
			if (!categoryId) return;
			void createProduct({ categoryId, ...input });
		},
		[categoryId, createProduct],
	);

	const updateProduct = useCallback(
		(id: Id<"products">, input: ProductInput) => {
			void patchProduct({ id, ...input });
		},
		[patchProduct],
	);

	const removeProduct = useCallback(
		(id: Id<"products">) => {
			void deleteProduct({ id });
		},
		[deleteProduct],
	);

	return {
		products,
		isLoading,
		addProduct,
		updateProduct,
		removeProduct,
	};
}
