import {
	ExternalLink,
	MoreVertical,
	Pencil,
	ShoppingBag,
	Trash2,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { Product } from "~/lib/mock-products";
import {
	availabilityBadgeVariant,
	availabilityLabels,
	discountPercent,
	formatPrice,
} from "~/lib/product-format";

export function ProductRow({
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
		<div className="flex items-center gap-3 border-b px-3 py-2 last:border-b-0 hover:bg-muted/50">
			<button
				type="button"
				onClick={onOpen}
				className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted"
			>
				{product.imageUrl ? (
					<img
						src={product.imageUrl}
						alt=""
						className="size-full object-cover"
					/>
				) : (
					<ShoppingBag className="size-4 text-muted-foreground" />
				)}
			</button>

			<button
				type="button"
				onClick={onOpen}
				className="min-w-0 flex-1 text-left"
			>
				<p className="truncate font-medium hover:underline">{product.name}</p>
				<p className="truncate text-xs text-muted-foreground">
					{product.source}
				</p>
			</button>

			{product.availability && (
				<Badge
					variant={availabilityBadgeVariant[product.availability]}
					className="hidden sm:inline-flex"
				>
					{availabilityLabels[product.availability]}
				</Badge>
			)}

			<div className="flex shrink-0 items-center gap-2">
				<span className="font-semibold">
					{formatPrice(product.currentPrice)}
				</span>
				{discount !== undefined && product.previousPrice && (
					<span className="hidden text-xs text-muted-foreground line-through sm:inline">
						{formatPrice(product.previousPrice)}
					</span>
				)}
			</div>

			<Button
				variant="ghost"
				size="icon-sm"
				render={<a href={product.url} target="_blank" rel="noreferrer" />}
				aria-label="Open product link"
			>
				<ExternalLink />
			</Button>

			<DropdownMenu>
				<DropdownMenuTrigger
					render={
						<Button
							variant="ghost"
							size="icon-sm"
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
