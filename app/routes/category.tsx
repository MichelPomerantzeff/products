import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

import { CategoryFormDialog } from "~/components/Category/CategoryFormDialog";
import { DeleteCategoryDialog } from "~/components/Category/DeleteCategoryDialog";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useCategories } from "~/lib/categories-store";
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
	const { categories } = useCategories();
	const category = categories.find((c) => c.slug === slug);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	if (!category) {
		return (
			<main className="p-6">
				<h1 className="text-2xl font-semibold">{slug}</h1>
				<p className="mt-2 text-muted-foreground">
					Placeholder page for category "{slug}".
				</p>
			</main>
		);
	}

	return (
		<main className="p-6">
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
						<category.icon className="size-5" />
					</div>
					<div>
						<h1 className="text-2xl font-semibold">{category.label}</h1>
						<p className="text-sm text-muted-foreground">
							{category.count} products
						</p>
					</div>
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<Button variant="outline" onClick={() => setIsEditOpen(true)}>
						<Pencil />
						Edit
					</Button>
					<Button variant="outline" onClick={() => setIsDeleteOpen(true)}>
						<Trash2 />
						Delete
					</Button>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button
								variant="outline"
								size="icon"
								className="md:hidden"
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

			<CategoryFormDialog
				mode="edit"
				category={category}
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
			/>
			<DeleteCategoryDialog
				category={category}
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
			/>
		</main>
	);
}
