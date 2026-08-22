import { useParams } from "react-router";

import { categories } from "~/lib/categories";
import type { Route } from "./+types/categoria";

export function meta({ params }: Route.MetaArgs) {
  const category = categories.find((c) => c.slug === params.slug);
  return [{ title: category?.label ?? "Categoria" }];
}

export default function Categoria() {
  const { slug } = useParams();
  const category = categories.find((c) => c.slug === slug);

  return (
    <main className="px-4 py-6">
      <div className="max-w-7xl m-auto">
        <h1 className="text-2xl font-semibold">{category?.label ?? slug}</h1>
        <p className="mt-2 text-muted-foreground">
          Página placeholder da categoria "{slug}".
        </p>
      </div>
    </main>
  );
}
