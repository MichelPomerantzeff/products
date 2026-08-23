import { PackageSearch, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";

export function EmptyProducts({ onAdd }: { onAdd: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
			<div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
				<PackageSearch className="size-6" />
			</div>
			<div>
				<p className="font-medium">No products in this category yet</p>
				<p className="text-sm text-muted-foreground">
					Add your first product to start tracking it here.
				</p>
			</div>
			<Button onClick={onAdd}>
				<Plus />
				Add product
			</Button>
		</div>
	);
}
