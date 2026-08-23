import type { LucideIcon } from "lucide-react";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

import { categories as initialCategories } from "~/lib/categories";

export type Category = {
	slug: string;
	label: string;
	icon: LucideIcon;
	count: number;
};

type NewCategoryInput = {
	label: string;
	icon: LucideIcon;
};

type CategoriesContextValue = {
	categories: Category[];
	addCategory: (input: NewCategoryInput) => void;
};

const CategoriesContext = createContext<CategoriesContextValue | null>(null);

function slugify(label: string) {
	return label
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function CategoriesProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [categories, setCategories] = useState<Category[]>(initialCategories);

	const addCategory = useCallback(({ label, icon }: NewCategoryInput) => {
		const trimmedLabel = label.trim();
		if (!trimmedLabel) return;

		setCategories((current) => [
			...current,
			{ slug: slugify(trimmedLabel), label: trimmedLabel, icon, count: 0 },
		]);
	}, []);

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
