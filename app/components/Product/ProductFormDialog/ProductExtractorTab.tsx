import { useAction } from "convex/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Availability } from "~/lib/products-store";
import { api } from "../../../../convex/_generated/api";
import { AVAILABILITY_LABELS } from "./availability";
import { Field } from "./Field";
import type { ProductForm } from "./product-form";

type ExtractedProduct = {
	name?: string;
	currentPrice?: number;
	previousPrice?: number;
	imageUrl?: string;
	description?: string;
	features?: string[];
	availability?: Availability;
};

type ExtractState =
	| { status: "idle" }
	| { status: "loading" }
	| { status: "error"; message: string }
	| { status: "success"; data: ExtractedProduct };

export function ProductExtractorTab({
	onApply,
}: {
	onApply: (fields: Partial<ProductForm>) => void;
}) {
	const [extractUrl, setExtractUrl] = useState("");
	const [extractState, setExtractState] = useState<ExtractState>({
		status: "idle",
	});
	const extract = useAction(api.productExtractor.extract);

	const isExtractUrlValid = (() => {
		try {
			new URL(extractUrl);
			return true;
		} catch {
			return false;
		}
	})();

	const handleExtract = async () => {
		if (!isExtractUrlValid) return;
		setExtractState({ status: "loading" });
		try {
			const data = await extract({ url: extractUrl });
			setExtractState({ status: "success", data });
		} catch (error) {
			setExtractState({
				status: "error",
				message:
					error instanceof Error
						? error.message
						: "Não foi possível extrair dados desta página",
			});
		}
	};

	const handleUseExtractedData = () => {
		if (extractState.status !== "success") return;
		const data = extractState.data;

		let source = "";
		try {
			source = new URL(extractUrl).hostname.replace(/^www\./, "");
		} catch {
			source = "";
		}

		onApply({
			...(data.name !== undefined ? { name: data.name } : {}),
			...(data.currentPrice !== undefined
				? { currentPrice: String(data.currentPrice) }
				: {}),
			...(data.previousPrice !== undefined
				? { previousPrice: String(data.previousPrice) }
				: {}),
			...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
			...(data.description !== undefined
				? { description: data.description }
				: {}),
			...(data.features !== undefined
				? { features: data.features.join(", ") }
				: {}),
			...(data.availability !== undefined
				? { availability: data.availability }
				: {}),
			source,
			url: extractUrl,
		});
	};

	return (
		<>
			<Field label="Product URL" htmlFor="extract-url">
				<div className="flex gap-2">
					<Input
						id="extract-url"
						type="url"
						value={extractUrl}
						onChange={(event) => {
							setExtractUrl(event.target.value);
							setExtractState({ status: "idle" });
						}}
						placeholder="https://..."
						autoFocus
					/>
					<Button
						type="button"
						onClick={handleExtract}
						disabled={!isExtractUrlValid || extractState.status === "loading"}
					>
						{extractState.status === "loading" && (
							<Loader2 className="size-4 animate-spin" />
						)}
						Extrair
					</Button>
				</div>
			</Field>

			{extractState.status === "error" && (
				<p className="text-sm text-destructive">{extractState.message}</p>
			)}

			{extractState.status === "success" && (
				<div className="flex flex-col gap-3 rounded-lg border bg-background p-4">
					{extractState.data.imageUrl && (
						<img
							src={extractState.data.imageUrl}
							alt={extractState.data.name ?? "Product preview"}
							className="h-32 w-32 self-center rounded-md object-contain"
						/>
					)}
					{extractState.data.name && (
						<p className="font-medium">{extractState.data.name}</p>
					)}
					<div className="flex gap-3 text-sm">
						{extractState.data.currentPrice !== undefined && (
							<span className="font-semibold">
								€{extractState.data.currentPrice}
							</span>
						)}
						{extractState.data.previousPrice !== undefined && (
							<span className="text-muted-foreground line-through">
								€{extractState.data.previousPrice}
							</span>
						)}
					</div>
					{extractState.data.availability && (
						<span className="text-sm text-muted-foreground">
							{AVAILABILITY_LABELS[extractState.data.availability]}
						</span>
					)}
					{extractState.data.description && (
						<p className="text-sm text-muted-foreground">
							{extractState.data.description}
						</p>
					)}
					{extractState.data.features &&
						extractState.data.features.length > 0 && (
							<ul className="list-inside list-disc text-sm text-muted-foreground">
								{extractState.data.features.map((feature) => (
									<li key={feature}>{feature}</li>
								))}
							</ul>
						)}
					<Button type="button" onClick={handleUseExtractedData}>
						Usar estes dados
					</Button>
				</div>
			)}

			{extractState.status === "idle" && (
				<p className="text-sm text-muted-foreground">
					Cole a URL de uma página de produto e clique em &quot;Extrair&quot;.
				</p>
			)}
		</>
	);
}
