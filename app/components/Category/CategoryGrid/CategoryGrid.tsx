import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { CategoryFormDialog } from "~/components/Category/CategoryFormDialog";
import { CategorySetupWizard } from "~/components/Category/CategorySetupWizard/CategorySetupWizard";
import { EmptyCategories } from "~/components/Category/EmptyCategories/EmptyCategories";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCategories } from "~/lib/categories-store";
import { CategoryCard } from "./CategoryCard";

export function CategoryGrid() {
	const { categories, isLoading } = useCategories();
	const [query, setQuery] = useState("");
	const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
	const [isWizardOpen, setIsWizardOpen] = useState(false);

	const filteredCategories = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) return categories;
		return categories.filter((category) =>
			category.label.toLowerCase().includes(normalized),
		);
	}, [query, categories]);

	// Categories load client-side (Convex). Render nothing until the list has
	// settled so the empty state never flashes before real data arrives.
	if (isLoading) return null;

	const hasCategories = categories.length > 0;

	return (
		<div className="flex flex-col gap-4">
			{hasCategories ? (
				<>
					<div className="flex items-center justify-between gap-4">
						<div className="relative w-full max-w-xs">
							<Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
							<Input
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Search category..."
								className="pl-7"
								aria-label="Search category"
							/>
						</div>
						<Button onClick={() => setIsCreateCategoryOpen(true)}>
							<Plus />
							Create category
						</Button>
					</div>

					{filteredCategories.length === 0 ? (
						<p className="py-16 text-center text-sm text-muted-foreground">
							No category found.
						</p>
					) : (
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
							{filteredCategories.map((category) => (
								<CategoryCard key={category.slug} category={category} />
							))}
						</div>
					)}
				</>
			) : (
				<EmptyCategories
					onStartWizard={() => setIsWizardOpen(true)}
					onAddManually={() => setIsCreateCategoryOpen(true)}
				/>
			)}

			<CategoryFormDialog
				mode="create"
				open={isCreateCategoryOpen}
				onOpenChange={setIsCreateCategoryOpen}
			/>
			<CategorySetupWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />
		</div>
	);
}
