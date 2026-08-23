import { useCallback, useEffect, useState } from "react";
import { type Product, seedProductsFor } from "~/lib/mock-products";

function storageKey(categorySlug: string) {
	return `products:${categorySlug}`;
}

function readProducts(categorySlug: string): Product[] {
	try {
		const raw = localStorage.getItem(storageKey(categorySlug));
		if (raw) return JSON.parse(raw) as Product[];
	} catch {
		// localStorage unavailable (e.g. private mode) — fall through to seed data.
	}
	return seedProductsFor(categorySlug);
}

function writeProducts(categorySlug: string, products: Product[]) {
	try {
		localStorage.setItem(storageKey(categorySlug), JSON.stringify(products));
	} catch {
		// Best-effort persistence only; in-memory state still works this session.
	}
}

export type ProductInput = Omit<Product, "id" | "categorySlug">;

export function useProducts(categorySlug: string) {
	const [products, setProducts] = useState<Product[] | undefined>(undefined);

	useEffect(() => {
		setProducts(readProducts(categorySlug));
	}, [categorySlug]);

	const persist = useCallback(
		(next: Product[]) => {
			setProducts(next);
			writeProducts(categorySlug, next);
		},
		[categorySlug],
	);

	const addProduct = useCallback(
		(input: ProductInput) => {
			const product: Product = {
				...input,
				id: crypto.randomUUID(),
				categorySlug,
			};
			persist([product, ...(products ?? [])]);
		},
		[categorySlug, products, persist],
	);

	const updateProduct = useCallback(
		(id: string, input: ProductInput) => {
			persist(
				(products ?? []).map((product) =>
					product.id === id ? { ...product, ...input } : product,
				),
			);
		},
		[products, persist],
	);

	const removeProduct = useCallback(
		(id: string) => {
			persist((products ?? []).filter((product) => product.id !== id));
		},
		[products, persist],
	);

	return {
		products: products ?? [],
		isLoading: products === undefined,
		addProduct,
		updateProduct,
		removeProduct,
	};
}
