import { Sparkles } from "lucide-react";

import { Button } from "~/components/ui/button";

/**
 * First-run panel shown by the category grid when the user has zero categories
 * and the list has finished loading. The wizard is the primary, obvious path;
 * the manual "add them one by one" link is deliberately small and grey next to
 * it (contrast effect).
 */
export function EmptyCategories({
	onStartWizard,
	onAddManually,
}: {
	onStartWizard: () => void;
	onAddManually: () => void;
}) {
	return (
		<div className="mx-auto flex max-w-md flex-col items-center gap-5 rounded-xl border border-dashed py-16 text-center">
			<div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
				<Sparkles className="size-6" />
			</div>
			<div className="flex flex-col gap-1">
				<p className="font-heading text-base font-medium">
					Let's set up your categories
				</p>
				<p className="text-sm text-muted-foreground">
					Answer three quick questions and we'll prepare a starter set for you.
				</p>
			</div>
			<Button size="lg" onClick={onStartWizard}>
				<Sparkles />
				Set up my categories
			</Button>
			<button
				type="button"
				onClick={onAddManually}
				className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
			>
				or add them one by one
			</button>
		</div>
	);
}
