import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import type { Availability, Product, ProductInput } from "~/lib/products-store";

const AVAILABILITY_OPTIONS: { value: Availability; label: string }[] = [
	{ value: "in_stock", label: "In stock" },
	{ value: "out_of_stock", label: "Out of stock" },
	{ value: "preorder", label: "Preorder" },
];

const AVAILABILITY_LABELS: Record<string, string> = {
	unset: "Not set",
	...Object.fromEntries(
		AVAILABILITY_OPTIONS.map((option) => [option.value, option.label]),
	),
};

type ProductForm = {
	name: string;
	url: string;
	source: string;
	currentPrice: string;
	previousPrice: string;
	imageUrl: string;
	description: string;
	features: string;
	availability: Availability | "";
};

function emptyForm(): ProductForm {
	return {
		name: "",
		url: "",
		source: "",
		currentPrice: "",
		previousPrice: "",
		imageUrl: "",
		description: "",
		features: "",
		availability: "",
	};
}

function formFromProduct(product: Product | undefined): ProductForm {
	if (!product) return emptyForm();
	return {
		name: product.name,
		url: product.url,
		source: product.source,
		currentPrice: String(product.currentPrice),
		previousPrice:
			product.previousPrice !== undefined ? String(product.previousPrice) : "",
		imageUrl: product.imageUrl ?? "",
		description: product.description ?? "",
		features: product.features?.join(", ") ?? "",
		availability: product.availability ?? "",
	};
}

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

	// Re-sync the form to the current product whenever the dialog is (re)opened,
	// so editing always starts from the latest values instead of a stale snapshot.
	useEffect(() => {
		if (!open) return;
		setForm(formFromProduct(product));
	}, [open, product]);

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

					<Tabs defaultValue="manual" className="mt-4 flex min-h-0 flex-1 flex-col">
						<TabsList className="w-full">
							<TabsTrigger value="manual">Manual</TabsTrigger>
							<TabsTrigger value="extractor">Product extractor</TabsTrigger>
						</TabsList>

						<TabsContent
							value="manual"
							className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1 p-4 mb-4 rounded-lg bg-muted"
						>
						<Field label="Name" htmlFor="product-name">
							<Input
								id="product-name"
								value={form.name}
								onChange={(event) =>
									setForm((f) => ({ ...f, name: event.target.value }))
								}
								placeholder="E.g.: Wireless headphones"
								autoFocus
							/>
						</Field>

						<Field label="Product URL" htmlFor="product-url">
							<Input
								id="product-url"
								type="url"
								value={form.url}
								onChange={(event) =>
									setForm((f) => ({ ...f, url: event.target.value }))
								}
								placeholder="https://..."
							/>
						</Field>

						<Field label="Source" htmlFor="product-source">
							<Input
								id="product-source"
								value={form.source}
								onChange={(event) =>
									setForm((f) => ({ ...f, source: event.target.value }))
								}
								placeholder="E.g.: Amazon"
							/>
						</Field>

						<div className="grid grid-cols-2 gap-3">
							<Field label="Current price (€)" htmlFor="product-current-price">
								<Input
									id="product-current-price"
									type="number"
									step="0.01"
									min="0"
									value={form.currentPrice}
									onChange={(event) =>
										setForm((f) => ({
											...f,
											currentPrice: event.target.value,
										}))
									}
									placeholder="0.00"
									className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
								/>
							</Field>

							<Field
								label="Previous price (€)"
								htmlFor="product-previous-price"
								optional
							>
								<Input
									id="product-previous-price"
									type="number"
									step="0.01"
									min="0"
									value={form.previousPrice}
									onChange={(event) =>
										setForm((f) => ({
											...f,
											previousPrice: event.target.value,
										}))
									}
									placeholder="0.00"
									className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
								/>
							</Field>
						</div>

						<Field label="Image URL" htmlFor="product-image" optional>
							<Input
								id="product-image"
								type="url"
								value={form.imageUrl}
								onChange={(event) =>
									setForm((f) => ({ ...f, imageUrl: event.target.value }))
								}
								placeholder="https://..."
							/>
						</Field>

						<Field label="Availability" htmlFor="product-availability" optional>
							<Select
								value={form.availability || "unset"}
								onValueChange={(value) =>
									setForm((f) => ({
										...f,
										availability:
											value === "unset" ? "" : (value as Availability),
									}))
								}
							>
								<SelectTrigger id="product-availability" className="w-full">
									<SelectValue>
										{(value: string) => AVAILABILITY_LABELS[value] ?? "Not set"}
									</SelectValue>
								</SelectTrigger>
								<SelectContent alignItemWithTrigger={false}>
									<SelectItem value="unset">Not set</SelectItem>
									{AVAILABILITY_OPTIONS.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</Field>

						<Field label="Description" htmlFor="product-description" optional>
							<Textarea
								id="product-description"
								value={form.description}
								onChange={(event) =>
									setForm((f) => ({
										...f,
										description: event.target.value,
									}))
								}
								placeholder="Short description..."
							/>
						</Field>

						<Field
							label="Features"
							htmlFor="product-features"
							optional
							hint="Comma-separated"
						>
							<Input
								id="product-features"
								value={form.features}
								onChange={(event) =>
									setForm((f) => ({ ...f, features: event.target.value }))
								}
								placeholder="E.g.: Waterproof, USB-C, 2-year warranty"
							/>
						</Field>
						</TabsContent>

						<TabsContent
							value="extractor"
							className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 p-4 mb-4 rounded-lg bg-muted text-center text-sm text-muted-foreground"
						>
							<p>Product extractor coming soon.</p>
							<p>Enter a product URL and we&apos;ll fill in the details for you.</p>
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

function Field({
	label,
	htmlFor,
	optional,
	hint,
	children,
}: {
	label: string;
	htmlFor: string;
	optional?: boolean;
	hint?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={htmlFor} className="text-sm font-medium">
				{label}
				{optional && (
					<span className="ml-1 font-normal text-muted-foreground">
						(optional)
					</span>
				)}
			</label>
			{children}
			{hint && <span className="text-xs text-muted-foreground">{hint}</span>}
		</div>
	);
}
