import type { Product } from "~/lib/products-store";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
	products,
	onOpen,
	onEdit,
	onDelete,
}: {
	products: Product[];
	onOpen: (product: Product) => void;
	onEdit: (product: Product) => void;
	onDelete: (product: Product) => void;
}) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{products.map((product) => (
				<ProductCard
					key={product.id}
					product={product}
					onOpen={() => onOpen(product)}
					onEdit={() => onEdit(product)}
					onDelete={() => onDelete(product)}
				/>
			))}
		</div>
	);
}
