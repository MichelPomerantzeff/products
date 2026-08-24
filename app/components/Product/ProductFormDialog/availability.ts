import type { Availability } from "~/lib/products-store";

export const AVAILABILITY_OPTIONS: { value: Availability; label: string }[] = [
	{ value: "in_stock", label: "In stock" },
	{ value: "out_of_stock", label: "Out of stock" },
	{ value: "preorder", label: "Preorder" },
];

export const AVAILABILITY_LABELS: Record<string, string> = {
	unset: "Not set",
	...Object.fromEntries(
		AVAILABILITY_OPTIONS.map((option) => [option.value, option.label]),
	),
};
