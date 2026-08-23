import { Search, Tag } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { useCategories } from "~/lib/categories-store";
import { categoryIcons } from "~/lib/category-icons";
import { cn } from "~/lib/utils";

const DEFAULT_ICON_NAME = "Tag";

export function CreateCategoryDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { addCategory } = useCategories();
	const [label, setLabel] = useState("");
	const [iconQuery, setIconQuery] = useState("");
	const [selectedIconName, setSelectedIconName] = useState(DEFAULT_ICON_NAME);

	const filteredIcons = useMemo(() => {
		const normalized = iconQuery.trim().toLowerCase();
		if (!normalized) return categoryIcons;
		return categoryIcons.filter((option) =>
			option.name.toLowerCase().includes(normalized),
		);
	}, [iconQuery]);

	const resetForm = () => {
		setLabel("");
		setIconQuery("");
		setSelectedIconName(DEFAULT_ICON_NAME);
	};

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) resetForm();
		onOpenChange(nextOpen);
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const trimmedLabel = label.trim();
		if (!trimmedLabel) return;

		const selectedIcon =
			categoryIcons.find((option) => option.name === selectedIconName)?.icon ??
			Tag;

		addCategory({ label: trimmedLabel, icon: selectedIcon });
		handleOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Criar categoria</DialogTitle>
					</DialogHeader>

					<div className="mt-4 flex flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<label htmlFor="category-label" className="text-sm font-medium">
								Nome
							</label>
							<Input
								id="category-label"
								value={label}
								onChange={(event) => setLabel(event.target.value)}
								placeholder="Ex: Cozinha"
								autoFocus
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<span className="text-sm font-medium">Ícone</span>
							<div className="relative">
								<Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
								<Input
									value={iconQuery}
									onChange={(event) => setIconQuery(event.target.value)}
									placeholder="Buscar ícone..."
									className="pl-7"
									aria-label="Buscar ícone"
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
										Nenhum ícone encontrado.
									</p>
								)}
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
						>
							Cancelar
						</Button>
						<Button type="submit" disabled={!label.trim()}>
							Criar
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
