import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";

import { CategoryFormDialog } from "~/components/Category/CategoryFormDialog";
import { DeleteCategoryDialog } from "~/components/Category/DeleteCategoryDialog";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { Category } from "~/lib/categories-store";

export function CategoryCard({ category }: { category: Category }) {
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	return (
		<div className="group/card relative">
			<NavLink
				to={`/categories/${category.slug}`}
				className="flex flex-col items-center gap-3 rounded-xl bg-card p-6 text-center text-sm text-card-foreground ring-1 ring-foreground/10 transition-colors hover:bg-muted/50"
			>
				<div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors group-hover/card:bg-primary/10 group-hover/card:text-primary">
					<category.icon className="size-5" />
				</div>
				<div>
					<p className="font-medium">{category.label}</p>
					<p className="text-xs text-muted-foreground">
						{category.count} products
					</p>
				</div>
			</NavLink>

			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							size="icon-sm"
							className="absolute top-2 right-2"
							aria-label="Category actions"
							onClick={(event) => event.preventDefault()}
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
		</div>
	);
}
