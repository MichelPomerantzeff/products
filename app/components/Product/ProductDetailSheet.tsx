import { ExternalLink, Pencil, ShoppingBag, Trash2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "~/components/ui/sheet";
import {
	availabilityBadgeVariant,
	availabilityLabels,
	discountPercent,
	formatPrice,
} from "~/lib/product-format";
import type { Product } from "~/lib/products-store";

export function ProductDetailSheet({
	product,
	open,
	onOpenChange,
	onEdit,
	onDelete,
}: {
	product: Product | undefined;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onEdit: () => void;
	onDelete: () => void;
}) {
	if (!product) return null;

	const discount = discountPercent(product.currentPrice, product.previousPrice);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="gap-0 p-0">
				<div className="scrollbar-thin flex flex-1 flex-col gap-4 overflow-y-auto">
					<div className="flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden bg-muted">
						{product.imageUrl ? (
							<img
								src={product.imageUrl}
								alt=""
								className="size-full object-cover"
							/>
						) : (
							<ShoppingBag className="size-10 text-muted-foreground" />
						)}
					</div>

					<SheetHeader>
						<p className="text-xs text-muted-foreground">{product.source}</p>
						<SheetTitle>{product.name}</SheetTitle>
						<SheetDescription className="flex flex-wrap items-center gap-2 pt-1">
							<span className="text-base font-semibold text-foreground">
								{formatPrice(product.currentPrice)}
							</span>
							{discount !== undefined && product.previousPrice && (
								<>
									<span className="line-through">
										{formatPrice(product.previousPrice)}
									</span>
									<Badge variant="destructive">-{discount}%</Badge>
								</>
							)}
							{product.availability && (
								<Badge variant={availabilityBadgeVariant[product.availability]}>
									{availabilityLabels[product.availability]}
								</Badge>
							)}
						</SheetDescription>
					</SheetHeader>

					<div className="flex flex-col gap-4 px-4 pb-4">
						{product.description && (
							<p className="text-sm text-muted-foreground">
								{product.description}
							</p>
						)}

						{product.features && product.features.length > 0 && (
							<div className="flex flex-col gap-1.5">
								<span className="text-sm font-medium">Features</span>
								<ul className="flex flex-col gap-1">
									{product.features.map((feature) => (
										<li key={feature} className="text-sm text-muted-foreground">
											• {feature}
										</li>
									))}
								</ul>
							</div>
						)}

						<Button
							variant="outline"
							render={<a href={product.url} target="_blank" rel="noreferrer" />}
						>
							<ExternalLink />
							Open product
						</Button>
					</div>
				</div>

				<SheetFooter className="flex-row border-t">
					<Button variant="outline" className="flex-1" onClick={onEdit}>
						<Pencil />
						Edit
					</Button>
					<Button variant="destructive" className="flex-1" onClick={onDelete}>
						<Trash2 />
						Delete
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
