import { MoreVertical, Pencil, ShoppingBag, Trash2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	availabilityBadgeVariant,
	availabilityLabels,
	discountPercent,
	formatPrice,
} from "~/lib/product-format";
import type { Product } from "~/lib/products-store";

export function ProductCard({
	product,
	onOpen,
	onEdit,
	onDelete,
}: {
	product: Product;
	onOpen: () => void;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const discount = discountPercent(product.currentPrice, product.previousPrice);

	return (
		<div className="group/card relative flex flex-col overflow-hidden rounded-xl bg-card text-sm text-card-foreground ring-1 ring-foreground/10">
			<button
				type="button"
				onClick={onOpen}
				className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-muted"
			>
				{product.imageUrl ? (
					<img
						src={product.imageUrl}
						alt=""
						className="size-full object-cover transition-transform group-hover/card:scale-105"
					/>
				) : (
					<ShoppingBag className="size-8 text-muted-foreground" />
				)}
				{discount !== undefined && (
					<Badge variant="destructive" className="absolute top-2 left-2">
						-{discount}%
					</Badge>
				)}
				{product.availability && (
					<Badge
						variant={availabilityBadgeVariant[product.availability]}
						className="absolute bottom-2 left-2 bg-popover/90"
					>
						{availabilityLabels[product.availability]}
					</Badge>
				)}
			</button>

			<div className="flex flex-1 flex-col gap-1.5 p-3">
				<p className="text-xs text-muted-foreground">{product.source}</p>
				<button
					type="button"
					onClick={onOpen}
					className="line-clamp-2 text-left font-medium hover:underline"
				>
					{product.name}
				</button>
				<div className="mt-auto flex items-center gap-2 pt-1">
					<span className="font-semibold">
						{formatPrice(product.currentPrice)}
					</span>
					{discount !== undefined && product.previousPrice && (
						<span className="text-xs text-muted-foreground line-through">
							{formatPrice(product.previousPrice)}
						</span>
					)}
				</div>
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="outline"
							size="icon-sm"
							className="absolute top-2 right-2 bg-popover/90"
							aria-label="Product actions"
						/>
					}
				>
					<MoreVertical />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={onEdit}>
						<Pencil />
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem variant="destructive" onClick={onDelete}>
						<Trash2 />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
