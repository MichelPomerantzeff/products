import { useParams } from "react-router";

import { useCategories } from "~/lib/categories-store";
import type { Route } from "./+types/category";

export function meta({ params }: Route.MetaArgs) {
	// Runs outside the component tree (no access to CategoriesProvider/Convex),
	// so it uses the slug as an approximation of the title instead of the real label.
	const fallbackTitle = params.slug
		? params.slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
		: "Category";
	return [{ title: fallbackTitle }];
}

export default function Category() {
	const { slug } = useParams();
	const { categories } = useCategories();
	const category = categories.find((c) => c.slug === slug);

	return (
		<main className="p-6">
			<h1 className="text-2xl font-semibold">{category?.label ?? slug}</h1>
			<p className="mt-2 text-muted-foreground">
				Placeholder page for category "{slug}".
			</p>
		</main>
	);
}
