import { ArrowLeft, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";

import { CategoryFormDialog } from "~/components/Category/CategoryFormDialog";
import { DeleteCategoryDialog } from "~/components/Category/DeleteCategoryDialog";
import { DeleteProductDialog } from "~/components/Product/DeleteProductDialog";
import { EmptyProducts } from "~/components/Product/EmptyProducts";
import { ProductDetailSheet } from "~/components/Product/ProductDetailSheet";
import { ProductFormDialog } from "~/components/Product/ProductFormDialog";
import { ProductGrid } from "~/components/Product/ProductGrid";
import { ProductList } from "~/components/Product/ProductList";
import { ProductViewToggle } from "~/components/Product/ProductViewToggle";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useCategories } from "~/lib/categories-store";
import { type Product, useProducts } from "~/lib/products-store";
import { useProductViewMode } from "~/lib/use-product-view-mode";
import type { Route } from "./+types/category";

export function meta({ params }: Route.MetaArgs) {
	// Runs outside the component tree (no access to CategoriesProvider/Convex),
	// so it uses the slug as an approximation of the title instead of the real label.
	const fallbackTitle = params.slug
		? params.slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
		: "Category";
	return [{ title: fallbackTitle }];
}

export default function Category() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { categories, isLoading } = useCategories();
	const category = categories.find((c) => c.slug === slug);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	const { products, addProduct, updateProduct, removeProduct } = useProducts(
		category?.id,
	);
	const [viewMode, setViewMode] = useProductViewMode();
	const [isAddProductOpen, setIsAddProductOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState<Product | undefined>();
	const [detailProduct, setDetailProduct] = useState<Product | undefined>();
	const [deletingProduct, setDeletingProduct] = useState<Product | undefined>();

	// Data loads client-side (Convex), so don't flash a "not found" error for a
	// valid category while its query is still in flight.
	if (isLoading) return null;

	if (!category) {
		return (
			<div>
				<h1 className="text-2xl font-semibold">404</h1>
				<p className="mt-2 text-muted-foreground">
					The requested category could not be found.
				</p>
				<Button className="mt-4" render={<NavLink to="/" />}>
					Back home
				</Button>
			</div>
		);
	}

	return (
		<div>
			<div className="flex items-center justify-between gap-2 mb-5">
				<Button className="-ml-2.5" variant="ghost" render={<NavLink to="/" />}>
					<ArrowLeft />
					Back to categories
				</Button>
				<Button onClick={() => setIsAddProductOpen(true)}>
					<Plus />
					Add product
				</Button>
			</div>

			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
						<category.icon className="size-5" />
					</div>
					<div>
						<h1 className="text-2xl font-semibold">{category.label}</h1>
						<p className="text-sm text-muted-foreground">
							{products.length} products
						</p>
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button
								variant="outline"
								size="icon"
								aria-label="Category actions"
							/>
						}
					>
						<MoreVertical />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => setIsEditOpen(true)}>
							<Pencil />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem
							variant="destructive"
							onClick={() => setIsDeleteOpen(true)}
						>
							<Trash2 />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="mt-6 flex items-center justify-between gap-4">
				<ProductViewToggle mode={viewMode} onChange={setViewMode} />
			</div>

			<div className="mt-4">
				{products.length === 0 ? (
					<EmptyProducts onAdd={() => setIsAddProductOpen(true)} />
				) : viewMode === "grid" ? (
					<ProductGrid
						products={products}
						onOpen={setDetailProduct}
						onEdit={setEditingProduct}
						onDelete={setDeletingProduct}
					/>
				) : (
					<ProductList
						products={products}
						onOpen={setDetailProduct}
						onEdit={setEditingProduct}
						onDelete={setDeletingProduct}
					/>
				)}
			</div>

			<CategoryFormDialog
				mode="edit"
				category={category}
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
				onSaved={(newSlug) => navigate(`/categories/${newSlug}`)}
			/>
			<DeleteCategoryDialog
				category={category}
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				onDeleted={() => navigate("/")}
			/>

			<ProductFormDialog
				mode="create"
				open={isAddProductOpen}
				onOpenChange={setIsAddProductOpen}
				onSubmit={addProduct}
			/>
			<ProductFormDialog
				mode="edit"
				product={editingProduct}
				open={editingProduct !== undefined}
				onOpenChange={(open) => {
					if (!open) setEditingProduct(undefined);
				}}
				onSubmit={(input) => {
					if (editingProduct) updateProduct(editingProduct.id, input);
				}}
			/>
			<ProductDetailSheet
				product={detailProduct}
				open={detailProduct !== undefined}
				onOpenChange={(open) => {
					if (!open) setDetailProduct(undefined);
				}}
				onEdit={() => {
					if (detailProduct) setEditingProduct(detailProduct);
					setDetailProduct(undefined);
				}}
				onDelete={() => {
					if (detailProduct) setDeletingProduct(detailProduct);
					setDetailProduct(undefined);
				}}
			/>
			<DeleteProductDialog
				product={deletingProduct}
				open={deletingProduct !== undefined}
				onOpenChange={(open) => {
					if (!open) setDeletingProduct(undefined);
				}}
				onConfirm={() => {
					if (deletingProduct) removeProduct(deletingProduct.id);
				}}
			/>
		</div>
	);
}
