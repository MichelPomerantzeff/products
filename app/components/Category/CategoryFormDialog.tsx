import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import type { Category } from "~/lib/categories-store";
import { useCategories } from "~/lib/categories-store";
import { categoryIcons } from "~/lib/category-icons";
import { cn } from "~/lib/utils";

const DEFAULT_ICON_NAME = "Tag";

function iconNameFor(category: Category | undefined) {
	if (!category) return DEFAULT_ICON_NAME;
	return (
		categoryIcons.find((option) => option.icon === category.icon)?.name ??
		DEFAULT_ICON_NAME
	);
}

export function CategoryFormDialog({
	mode,
	category,
	open,
	onOpenChange,
}: {
	mode: "create" | "edit";
	category?: Category;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { addCategory } = useCategories();
	const [label, setLabel] = useState(category?.label ?? "");
	const [iconQuery, setIconQuery] = useState("");
	const [selectedIconName, setSelectedIconName] = useState(
		iconNameFor(category),
	);

	// Re-sync the form to the current category whenever the dialog is (re)opened,
	// so editing always starts from the latest values instead of a stale snapshot.
	useEffect(() => {
		if (!open) return;
		setLabel(category?.label ?? "");
		setIconQuery("");
		setSelectedIconName(iconNameFor(category));
	}, [open, category]);

	const filteredIcons = useMemo(() => {
		const normalized = iconQuery.trim().toLowerCase();
		if (!normalized) return categoryIcons;
		return categoryIcons.filter((option) =>
			option.name.toLowerCase().includes(normalized),
		);
	}, [iconQuery]);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const trimmedLabel = label.trim();
		if (!trimmedLabel) return;

		if (mode === "create") {
			addCategory({ label: trimmedLabel, iconName: selectedIconName });
		}
		// Edit mode doesn't persist yet — there's no `update` mutation in Convex
		// yet (UI-only per docs/specs/editar-excluir-categorias-ui.md). This just
		// closes the dialog until that's wired up.

		onOpenChange(false);
	};

	const title = mode === "create" ? "Create category" : "Edit category";
	const submitLabel = mode === "create" ? "Create" : "Save changes";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
					</DialogHeader>

					<div className="mt-4 flex flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<label htmlFor="category-label" className="text-sm font-medium">
								Name
							</label>
							<Input
								id="category-label"
								value={label}
								onChange={(event) => setLabel(event.target.value)}
								placeholder="E.g.: Kitchen"
								autoFocus
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<span className="text-sm font-medium">Icon</span>
							<div className="relative">
								<Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
								<Input
									value={iconQuery}
									onChange={(event) => setIconQuery(event.target.value)}
									placeholder="Search icon..."
									className="pl-7"
									aria-label="Search icon"
								/>
							</div>
							<div className="scrollbar-thin grid max-h-40 grid-cols-6 gap-1 overflow-y-auto rounded-md border p-1.5">
								{filteredIcons.map((option) => {
									const isSelected = option.name === selectedIconName;
									return (
										<button
											key={option.name}
											type="button"
											title={option.name}
											onClick={() => setSelectedIconName(option.name)}
											className={cn(
												"flex size-9 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
												isSelected &&
													"border-primary bg-primary/10 text-primary",
											)}
										>
											<option.icon className="size-4" />
										</button>
									);
								})}
								{filteredIcons.length === 0 && (
									<p className="col-span-6 py-2 text-center text-xs text-muted-foreground">
										No icon found.
									</p>
								)}
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={!label.trim()}>
							{submitLabel}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
