import type { Availability } from "~/lib/mock-products";

const priceFormatter = new Intl.NumberFormat("en-IE", {
	style: "currency",
	currency: "EUR",
});

export function formatPrice(value: number) {
	return priceFormatter.format(value);
}

export function discountPercent(currentPrice: number, previousPrice?: number) {
	if (!previousPrice || previousPrice <= currentPrice) return undefined;
	return Math.round((1 - currentPrice / previousPrice) * 100);
}

export const availabilityLabels: Record<Availability, string> = {
	in_stock: "In stock",
	out_of_stock: "Out of stock",
	preorder: "Preorder",
};

export const availabilityBadgeVariant: Record<
	Availability,
	"success" | "destructive" | "warning"
> = {
	in_stock: "success",
	out_of_stock: "destructive",
	preorder: "warning",
};
