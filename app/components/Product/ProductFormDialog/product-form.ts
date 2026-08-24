import type { Availability, Product } from "~/lib/products-store";

export type ProductForm = {
	name: string;
	url: string;
	source: string;
	currentPrice: string;
	previousPrice: string;
	imageUrl: string;
	description: string;
	features: string;
	availability: Availability | "";
};

export function emptyForm(): ProductForm {
	return {
		name: "",
		url: "",
		source: "",
		currentPrice: "",
		previousPrice: "",
		imageUrl: "",
		description: "",
		features: "",
		availability: "",
	};
}

export function formFromProduct(product: Product | undefined): ProductForm {
	if (!product) return emptyForm();
	return {
		name: product.name,
		url: product.url,
		source: product.source,
		currentPrice: String(product.currentPrice),
		previousPrice:
			product.previousPrice !== undefined ? String(product.previousPrice) : "",
		imageUrl: product.imageUrl ?? "",
		description: product.description ?? "",
		features: product.features?.join(", ") ?? "",
		availability: product.availability ?? "",
	};
}
