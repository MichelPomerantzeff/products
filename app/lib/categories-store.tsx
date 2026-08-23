import { useMutation, useQuery } from "convex/react";
import type { LucideIcon } from "lucide-react";
import { createContext, useCallback, useContext, useMemo } from "react";
import { categoryIcons } from "~/lib/category-icons";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export type Category = {
	id: Id<"categories">;
	slug: string;
	label: string;
	icon: LucideIcon;
	count: number;
};

type CategoryInput = {
	label: string;
	iconName: string;
};

type CategoriesContextValue = {
	categories: Category[];
	isLoading: boolean;
	addCategory: (input: CategoryInput) => void;
	updateCategory: (
		id: Id<"categories">,
		input: CategoryInput,
	) => Promise<string | undefined>;
	removeCategory: (id: Id<"categories">) => void;
};

const DEFAULT_ICON = categoryIcons[0].icon;

function resolveIcon(iconName: string): LucideIcon {
	return (
		categoryIcons.find((option) => option.name === iconName)?.icon ??
		DEFAULT_ICON
	);
}

const CategoriesContext = createContext<CategoriesContextValue | null>(null);

export function CategoriesProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const rawCategories = useQuery(api.categories.list);
	const isLoading = rawCategories === undefined;
	const createCategory = useMutation(api.categories.create);
	const patchCategory = useMutation(api.categories.update);
	const deleteCategory = useMutation(api.categories.remove);

	const categories = useMemo<Category[]>(
		() =>
			(rawCategories ?? []).map((category) => ({
				id: category._id,
				slug: category.slug,
				label: category.label,
				count: category.count,
				icon: resolveIcon(category.iconName),
			})),
		[rawCategories],
	);

	const addCategory = useCallback(
		({ label, iconName }: CategoryInput) => {
			const trimmedLabel = label.trim();
			if (!trimmedLabel) return;
			void createCategory({ label: trimmedLabel, iconName });
		},
		[createCategory],
	);

	const updateCategory = useCallback(
		async (id: Id<"categories">, { label, iconName }: CategoryInput) => {
			const trimmedLabel = label.trim();
			if (!trimmedLabel) return undefined;
			return patchCategory({ id, label: trimmedLabel, iconName });
		},
		[patchCategory],
	);

	const removeCategory = useCallback(
		(id: Id<"categories">) => {
			void deleteCategory({ id });
		},
		[deleteCategory],
	);

	const value = useMemo(
		() => ({
			categories,
			isLoading,
			addCategory,
			updateCategory,
			removeCategory,
		}),
		[categories, isLoading, addCategory, updateCategory, removeCategory],
	);

	return (
		<CategoriesContext.Provider value={value}>
			{children}
		</CategoriesContext.Provider>
	);
}

export function useCategories() {
	const context = useContext(CategoriesContext);
	if (!context) {
		throw new Error("useCategories must be used within a CategoriesProvider");
	}
	return context;
}
