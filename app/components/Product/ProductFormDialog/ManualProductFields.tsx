import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import type { Availability } from "~/lib/products-store";
import { AVAILABILITY_LABELS, AVAILABILITY_OPTIONS } from "./availability";
import { Field } from "./Field";
import type { ProductForm } from "./product-form";

export function ManualProductFields({
	form,
	setForm,
}: {
	form: ProductForm;
	setForm: (updater: (f: ProductForm) => ProductForm) => void;
}) {
	return (
		<>
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
							availability: value === "unset" ? "" : (value as Availability),
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
		</>
	);
}
