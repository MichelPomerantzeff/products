import { ProductRow } from "~/components/Product/ProductRow";
import type { Product } from "~/lib/mock-products";

export function ProductList({
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
		<div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
			{products.map((product) => (
				<ProductRow
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
