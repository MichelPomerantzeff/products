import { Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { resolveIcon, useCategories } from "~/lib/categories-store";
import type {
	ComingUpId,
	DomainId,
	OrganiseStyle,
} from "~/lib/category-presets";
import {
	buildSuggestions,
	COMING_UP_OPTIONS,
	DOMAIN_OPTIONS,
	STYLE_OPTIONS,
} from "~/lib/category-presets";
import { slugify } from "~/lib/slugify";
import { cn } from "~/lib/utils";

type Step = "q1" | "q2" | "q3" | "review" | "success";

/**
 * Progress per step. Illustrative proportions, not a contract: the intent is
 * "never starts empty, monotonic, accelerating toward the end" (goal-gradient).
 */
const STEP_PROGRESS: Record<Step, number> = {
	q1: 35,
	q2: 65,
	q3: 85,
	review: 95,
	success: 100,
};

const DEFAULT_DOMAINS: DomainId[] = DOMAIN_OPTIONS.filter(
	(option) => option.defaultSelected,
).map((option) => option.id);

function pluralCategories(n: number) {
	return `${n} ${n === 1 ? "category" : "categories"}`;
}

function WizardProgress({ value }: { value: number }) {
	return (
		<div
			className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
			role="progressbar"
			aria-valuenow={value}
			aria-valuemin={0}
			aria-valuemax={100}
		>
			<div
				className="h-full rounded-full bg-primary transition-all duration-300"
				style={{ width: `${value}%` }}
			/>
		</div>
	);
}

function OptionRow({
	shape,
	selected,
	onClick,
	children,
}: {
	shape: "checkbox" | "radio";
	selected: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			aria-pressed={selected}
			onClick={onClick}
			className={cn(
				"flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
				selected
					? "border-primary bg-primary/10 text-foreground"
					: "border-border hover:bg-muted",
			)}
		>
			<span
				className={cn(
					"flex size-4 shrink-0 items-center justify-center rounded border",
					selected
						? "border-primary bg-primary text-primary-foreground"
						: "border-muted-foreground/40",
					shape === "radio" && "rounded-full",
				)}
			>
				{selected && <Check className="size-3" />}
			</span>
			<span>{children}</span>
		</button>
	);
}

/**
 * Category setup wizard: one dialog whose body swaps between three questions, a
 * review step, then a success step. Closing at any point discards all answers;
 * reopening starts fresh.
 */
export function CategorySetupWizard({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { addManyCategories } = useCategories();

	const [step, setStep] = useState<Step>("q1");
	const [domains, setDomains] = useState<DomainId[]>(DEFAULT_DOMAINS);
	const [style, setStyle] = useState<OrganiseStyle>("product");
	const [comingUp, setComingUp] = useState<ComingUpId>("none");
	const [checkedSlugs, setCheckedSlugs] = useState<Set<string>>(new Set());
	const [isCreating, setIsCreating] = useState(false);
	const [created, setCreated] = useState<number | null>(null);
	// Signature of the suggestion set the checkboxes were last seeded from, so
	// stepping back and forward without changing an answer keeps the user's
	// unchecks instead of resetting them.
	const seededSignature = useRef<string | null>(null);

	// Reset to a clean state every time the dialog is (re)opened.
	useEffect(() => {
		if (!open) return;
		setStep("q1");
		setDomains(DEFAULT_DOMAINS);
		setStyle("product");
		setComingUp("none");
		setCheckedSlugs(new Set());
		setIsCreating(false);
		setCreated(null);
		seededSignature.current = null;
	}, [open]);

	const suggestions = useMemo(
		() => buildSuggestions({ domains, style, comingUp }),
		[domains, style, comingUp],
	);

	// Entering the review step checks every suggested row by default (smart
	// default). Reseed only when the suggestion set itself changed, so returning
	// to review after an unchanged answer preserves what the user unchecked.
	useEffect(() => {
		if (step !== "review") return;
		const slugs = suggestions.map((s) => slugify(s.label));
		const signature = slugs.join("|");
		if (seededSignature.current === signature) return;
		seededSignature.current = signature;
		setCheckedSlugs(new Set(slugs));
	}, [step, suggestions]);

	const toggleDomain = (id: DomainId) => {
		setDomains((prev) =>
			prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
		);
	};

	const toggleChecked = (slug: string) => {
		setCheckedSlugs((prev) => {
			const next = new Set(prev);
			if (next.has(slug)) next.delete(slug);
			else next.add(slug);
			return next;
		});
	};

	const checkedSuggestions = suggestions.filter((s) =>
		checkedSlugs.has(slugify(s.label)),
	);

	const handleCreate = async () => {
		setIsCreating(true);
		try {
			const result = await addManyCategories(
				checkedSuggestions.map((s) => ({
					label: s.label,
					iconName: s.iconName,
				})),
			);
			setCreated(result.created);
			setStep("success");
		} finally {
			setIsCreating(false);
		}
	};

	const title =
		step === "q1"
			? "What do you shop for?"
			: step === "q2"
				? "How do you like to organise?"
				: step === "q3"
					? "Anything coming up?"
					: step === "review"
						? "Review your categories"
						: created && created > 0
							? "Your workspace is ready"
							: "All set";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<WizardProgress value={STEP_PROGRESS[step]} />
				</DialogHeader>

				<div className="mt-1 flex flex-col gap-3">
					{step === "q1" && (
						<>
							<div className="grid grid-cols-2 gap-2">
								{DOMAIN_OPTIONS.map((option) => (
									<OptionRow
										key={option.id}
										shape="checkbox"
										selected={domains.includes(option.id)}
										onClick={() => toggleDomain(option.id)}
									>
										{option.label}
									</OptionRow>
								))}
							</div>
							{domains.length === 0 && (
								<p className="text-xs text-muted-foreground">
									Pick at least one to continue.
								</p>
							)}
						</>
					)}

					{step === "q2" && (
						<div className="flex flex-col gap-2">
							{STYLE_OPTIONS.map((option) => (
								<OptionRow
									key={option.id}
									shape="radio"
									selected={style === option.id}
									onClick={() => setStyle(option.id)}
								>
									{option.label}
								</OptionRow>
							))}
						</div>
					)}

					{step === "q3" && (
						<>
							<div className="flex flex-col gap-2">
								{COMING_UP_OPTIONS.map((option) => (
									<OptionRow
										key={option.id}
										shape="radio"
										selected={comingUp === option.id}
										onClick={() => setComingUp(option.id)}
									>
										{option.label}
									</OptionRow>
								))}
							</div>
							<p className="text-xs text-muted-foreground">
								Last question — leave it on "Nothing right now" to skip.
							</p>
						</>
					)}

					{step === "review" && (
						<>
							<p className="text-sm">
								We've prepared{" "}
								<span className="font-semibold">{suggestions.length}</span>{" "}
								{suggestions.length === 1 ? "category" : "categories"} for you.
							</p>
							<div className="scrollbar-thin flex max-h-64 flex-col gap-1 overflow-y-auto rounded-md border p-1.5">
								{suggestions.map((suggestion) => {
									const slug = slugify(suggestion.label);
									const Icon = resolveIcon(suggestion.iconName);
									const isChecked = checkedSlugs.has(slug);
									return (
										<button
											key={slug}
											type="button"
											aria-pressed={isChecked}
											onClick={() => toggleChecked(slug)}
											className={cn(
												"flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted",
											)}
										>
											<span
												className={cn(
													"flex size-4 shrink-0 items-center justify-center rounded border",
													isChecked
														? "border-primary bg-primary text-primary-foreground"
														: "border-muted-foreground/40",
												)}
											>
												{isChecked && <Check className="size-3" />}
											</span>
											<Icon className="size-4 text-muted-foreground" />
											<span>{suggestion.label}</span>
										</button>
									);
								})}
							</div>
							{checkedSuggestions.length < 3 && (
								<p className="text-xs text-muted-foreground">
									Keeping a few makes your grid more useful — you can always
									remove them later.
								</p>
							)}
							<button
								type="button"
								onClick={() => onOpenChange(false)}
								className="self-start text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
							>
								Start from an empty page instead
							</button>
						</>
					)}

					{step === "success" && (
						<p className="py-2 text-sm">
							{created && created > 0
								? `Your workspace is ready · ${pluralCategories(created)}`
								: "Nothing new to add"}
						</p>
					)}
				</div>

				<DialogFooter>
					{step === "q1" && (
						<Button
							onClick={() => setStep("q2")}
							disabled={domains.length === 0}
						>
							Continue
						</Button>
					)}

					{step === "q2" && (
						<>
							<Button variant="outline" onClick={() => setStep("q1")}>
								Back
							</Button>
							<Button onClick={() => setStep("q3")}>Continue</Button>
						</>
					)}

					{step === "q3" && (
						<>
							<Button variant="outline" onClick={() => setStep("q2")}>
								Back
							</Button>
							<Button onClick={() => setStep("review")}>Continue</Button>
						</>
					)}

					{step === "review" && (
						<>
							<Button variant="outline" onClick={() => setStep("q3")}>
								Back
							</Button>
							<Button
								onClick={handleCreate}
								disabled={checkedSuggestions.length === 0 || isCreating}
							>
								{isCreating ? "Creating…" : "Create"}
							</Button>
						</>
					)}

					{step === "success" && (
						<Button onClick={() => onOpenChange(false)}>Done</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
