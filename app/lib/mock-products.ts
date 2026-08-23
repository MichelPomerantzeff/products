export type Availability = "in_stock" | "out_of_stock" | "preorder";

export type Product = {
	id: string;
	categorySlug: string;
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

export function seedProductsFor(categorySlug: string): Product[] {
	const base: Omit<Product, "id" | "categorySlug">[] = [
		{
			name: "Wireless Noise-Cancelling Headphones",
			url: "https://example.com/products/headphones",
			source: "SoundHub",
			currentPrice: 179.99,
			previousPrice: 229.99,
			imageUrl:
				"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
			description:
				"Over-ear headphones with active noise cancellation and 30-hour battery life.",
			features: ["Active noise cancellation", "30h battery", "Bluetooth 5.3"],
			availability: "in_stock",
		},
		{
			name: "Minimalist Ceramic Pour-Over Coffee Set With Wooden Stand",
			url: "https://example.com/products/coffee-set",
			source: "Brewline",
			currentPrice: 54.5,
			imageUrl:
				"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
			description:
				"Hand-glazed ceramic dripper, carafe, and oak stand for slow-brewed coffee.",
			availability: "in_stock",
		},
		{
			name: "Mechanical Keyboard (75%)",
			url: "https://example.com/products/keyboard",
			source: "KeyForge",
			currentPrice: 129,
			previousPrice: 149,
			features: ["Hot-swappable switches", "USB-C", "Aluminum frame"],
			availability: "preorder",
		},
		{
			name: "Foldable Travel Backpack",
			url: "https://example.com/products/backpack",
			source: "Wanderpack",
			currentPrice: 39.9,
			imageUrl:
				"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
			availability: "out_of_stock",
		},
		{
			name: "Desk Lamp",
			url: "https://example.com/products/desk-lamp",
			source: "Lumina",
			currentPrice: 24.99,
		},
	];

	return base.map((product, index) => ({
		...product,
		id: `${categorySlug}-seed-${index}`,
		categorySlug,
	}));
}
