import { LayoutGrid, List } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export type ProductViewMode = "grid" | "list";

export function ProductViewToggle({
	mode,
	onChange,
}: {
	mode: ProductViewMode;
	onChange: (mode: ProductViewMode) => void;
}) {
	return (
		<div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				aria-label="Grid view"
				aria-pressed={mode === "grid"}
				className={cn(mode === "grid" && "bg-muted text-foreground")}
				onClick={() => onChange("grid")}
			>
				<LayoutGrid />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				aria-label="List view"
				aria-pressed={mode === "list"}
				className={cn(mode === "list" && "bg-muted text-foreground")}
				onClick={() => onChange("list")}
			>
				<List />
			</Button>
		</div>
	);
}
