import { useParams } from "react-router";

import { categories } from "~/lib/categories";
import { useCategories } from "~/lib/categories-store";
import type { Route } from "./+types/categoria";

export function meta({ params }: Route.MetaArgs) {
	// Roda fora da árvore de componentes (sem acesso ao CategoriesProvider),
	// então só resolve categorias que já existiam no build.
	const category = categories.find((c) => c.slug === params.slug);
	return [{ title: category?.label ?? "Categoria" }];
}

export default function Categoria() {
	const { slug } = useParams();
	const { categories } = useCategories();
	const category = categories.find((c) => c.slug === slug);

	return (
		<main className="p-6">
			<h1 className="text-2xl font-semibold">{category?.label ?? slug}</h1>
			<p className="mt-2 text-muted-foreground">
				Página placeholder da categoria "{slug}".
			</p>
		</main>
	);
}
