import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { Product, ProductInput } from "~/lib/products-store";
import { ManualProductFields } from "./ManualProductFields";
import { ProductExtractorTab } from "./ProductExtractorTab";
import { formFromProduct, type ProductForm } from "./product-form";

export function ProductFormDialog({
	mode,
	product,
	open,
	onOpenChange,
	onSubmit,
}: {
	mode: "create" | "edit";
	product?: Product;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (input: ProductInput) => void;
}) {
	const [form, setForm] = useState(() => formFromProduct(product));
	const [activeTab, setActiveTab] = useState<"manual" | "extractor">("manual");

	// Re-sync the form to the current product whenever the dialog is (re)opened,
	// so editing always starts from the latest values instead of a stale snapshot.
	useEffect(() => {
		if (!open) return;
		setForm(formFromProduct(product));
		setActiveTab("manual");
	}, [open, product]);

	const handleApplyExtractedData = (fields: Partial<ProductForm>) => {
		setForm((f) => ({ ...f, ...fields }));
		setActiveTab("manual");
	};

	const currentPrice = Number.parseFloat(form.currentPrice);
	const isValid =
		form.name.trim() !== "" &&
		form.url.trim() !== "" &&
		form.source.trim() !== "" &&
		!Number.isNaN(currentPrice);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (!isValid) return;

		const previousPrice = Number.parseFloat(form.previousPrice);

		onSubmit({
			name: form.name.trim(),
			url: form.url.trim(),
			source: form.source.trim(),
			currentPrice,
			previousPrice: Number.isNaN(previousPrice) ? undefined : previousPrice,
			imageUrl: form.imageUrl.trim() || undefined,
			description: form.description.trim() || undefined,
			features: form.features.trim()
				? form.features
						.split(",")
						.map((feature) => feature.trim())
						.filter(Boolean)
				: undefined,
			availability: form.availability === "" ? undefined : form.availability,
		});

		onOpenChange(false);
	};

	const title = mode === "create" ? "Add product" : "Edit product";
	const submitLabel = mode === "create" ? "Add" : "Save changes";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="flex max-h-[85vh] flex-col sm:max-w-xl">
				<form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
					<DialogHeader>
						<DialogTitle className="text-lg">{title}</DialogTitle>
					</DialogHeader>

					<Tabs
						value={activeTab}
						onValueChange={(value) =>
							setActiveTab(value as "manual" | "extractor")
						}
						className="mt-4 flex min-h-0 flex-1 flex-col"
					>
						<TabsList className="w-full">
							<TabsTrigger value="manual">Manual</TabsTrigger>
							<TabsTrigger value="extractor">Product extractor</TabsTrigger>
						</TabsList>

						<TabsContent
							value="manual"
							className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1 p-4 mb-4 rounded-lg bg-muted"
						>
							<ManualProductFields form={form} setForm={setForm} />
						</TabsContent>

						<TabsContent
							value="extractor"
							className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1 p-4 mb-4 rounded-lg bg-muted"
						>
							<ProductExtractorTab onApply={handleApplyExtractedData} />
						</TabsContent>
					</Tabs>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={!isValid}>
							{submitLabel}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
