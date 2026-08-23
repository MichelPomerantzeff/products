import { useMutation, useQuery } from "convex/react";
import type { LucideIcon } from "lucide-react";
import { createContext, useCallback, useContext, useMemo } from "react";
import { categoryIcons } from "~/lib/category-icons";
import { api } from "../../convex/_generated/api";

export type Category = {
	slug: string;
	label: string;
	icon: LucideIcon;
	count: number;
};

type NewCategoryInput = {
	label: string;
	iconName: string;
};

type CategoriesContextValue = {
	categories: Category[];
	addCategory: (input: NewCategoryInput) => void;
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
	const createCategory = useMutation(api.categories.create);

	const categories = useMemo<Category[]>(
		() =>
			(rawCategories ?? []).map((category) => ({
				slug: category.slug,
				label: category.label,
				count: category.count,
				icon: resolveIcon(category.iconName),
			})),
		[rawCategories],
	);

	const addCategory = useCallback(
		({ label, iconName }: NewCategoryInput) => {
			const trimmedLabel = label.trim();
			if (!trimmedLabel) return;
			void createCategory({ label: trimmedLabel, iconName });
		},
		[createCategory],
	);

	const value = useMemo(
		() => ({ categories, addCategory }),
		[categories, addCategory],
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
