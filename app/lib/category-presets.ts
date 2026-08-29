import { categoryIcons } from "~/lib/category-icons";
import { slugify } from "~/lib/slugify";

/**
 * Static answer-to-category presets for the category setup wizard.
 *
 * Suggestions are a hand-maintained table, not an LLM call — see
 * docs/adr/0001-static-category-presets.md. `buildSuggestions` is a pure,
 * synchronous function with no dependency on React, Convex, or the network so
 * it stays easy to reason about and to test in isolation.
 */

export type DomainId =
	| "tech"
	| "home"
	| "fashion"
	| "gaming"
	| "media"
	| "sports"
	| "beauty"
	| "gifts";

export type OrganiseStyle = "product" | "room" | "project";

export type ComingUpId = "moving" | "baby" | "trip" | "giftSeason" | "none";

export type WizardAnswers = {
	domains: DomainId[];
	style: OrganiseStyle;
	comingUp: ComingUpId;
};

export type SuggestedCategory = {
	label: string;
	iconName: string;
};

type WizardOption<Id extends string> = {
	id: Id;
	label: string;
	defaultSelected: boolean;
};

/** Question 1 — "What do you shop for?" (multi-select, first two pre-checked). */
export const DOMAIN_OPTIONS: WizardOption<DomainId>[] = [
	{ id: "tech", label: "Tech & gadgets", defaultSelected: true },
	{ id: "home", label: "Home & furniture", defaultSelected: true },
	{ id: "fashion", label: "Fashion", defaultSelected: false },
	{ id: "gaming", label: "Gaming", defaultSelected: false },
	{ id: "media", label: "Books & media", defaultSelected: false },
	{ id: "sports", label: "Sports & outdoors", defaultSelected: false },
	{ id: "beauty", label: "Beauty & health", defaultSelected: false },
	{ id: "gifts", label: "Gifts", defaultSelected: false },
];

/** Question 2 — "How do you like to organise?" (single-select). */
export const STYLE_OPTIONS: WizardOption<OrganiseStyle>[] = [
	{ id: "product", label: "By product type", defaultSelected: true },
	{ id: "room", label: "By room or area", defaultSelected: false },
	{ id: "project", label: "By project or goal", defaultSelected: false },
];

/** Question 3 — "Anything coming up?" (optional single-select, skippable). */
export const COMING_UP_OPTIONS: WizardOption<ComingUpId>[] = [
	{ id: "moving", label: "Moving home", defaultSelected: false },
	{ id: "baby", label: "New baby", defaultSelected: false },
	{ id: "trip", label: "A trip", defaultSelected: false },
	{ id: "giftSeason", label: "Gift season", defaultSelected: false },
	{ id: "none", label: "Nothing right now", defaultSelected: true },
];

/** Upper bound on how many suggestions the wizard ever proposes. */
export const MAX_SUGGESTIONS = 10;

const PRODUCT_CANDIDATES: Record<DomainId, string[]> = {
	tech: ["Laptops", "Phones", "Headphones", "Wearables"],
	home: ["Furniture", "Kitchen", "Decor", "Appliances"],
	fashion: ["Clothing", "Shoes", "Accessories"],
	gaming: ["Consoles", "Games", "Accessories"],
	media: ["Books", "Music", "Films"],
	sports: ["Fitness gear", "Outdoor", "Cycling"],
	beauty: ["Skincare", "Makeup", "Supplements"],
	gifts: ["Gift ideas"],
};

/** Areas every "by room" answer starts from, so the option is never empty. */
const ROOM_BASELINE = ["Office", "Bedroom", "Kitchen", "Storage"];

const ROOM_ADDITIONS: Partial<Record<DomainId, string[]>> = {
	tech: ["Office"],
	home: ["Living room"],
	sports: ["Garage"],
	beauty: ["Bathroom"],
};

const PROJECT_BUCKETS = ["Wishlist", "Gift ideas", "Deal watch"];

const COMING_UP_EXTRA: Record<ComingUpId, string[]> = {
	moving: ["New apartment"],
	baby: ["Baby gear"],
	trip: ["Travel kit"],
	giftSeason: ["Gifts"],
	none: [],
};

/**
 * Icon for each label any preset can produce. Every value is a `name` from
 * `categoryIcons`; unmapped labels fall back to the first icon so a suggestion
 * always carries a valid `iconName`.
 */
const ICON_BY_LABEL: Record<string, string> = {
	Laptops: "Laptop",
	Phones: "Electronics",
	Headphones: "Headphones",
	Wearables: "Watch",
	Furniture: "Furniture",
	Kitchen: "CookingPot",
	Decor: "Art",
	Appliances: "Hardware",
	Clothing: "Clothes",
	Shoes: "Clothes",
	Accessories: "Bag",
	Consoles: "Games",
	Games: "Games",
	Books: "Books",
	Music: "Music",
	Films: "Books",
	"Fitness gear": "Sports",
	Outdoor: "Tent",
	Cycling: "Sports",
	Skincare: "Sparkles",
	Makeup: "Sparkles",
	Supplements: "Health",
	"Gift ideas": "Gifts",
	Office: "Briefcase",
	Bedroom: "BedDouble",
	Storage: "Boxes",
	"Living room": "Sofa",
	Garage: "Car",
	Bathroom: "Bath",
	Wishlist: "Tag",
	"Deal watch": "Tag",
	"New apartment": "Home",
	"Baby gear": "Baby",
	"Travel kit": "Travel",
	Gifts: "Gifts",
};

const FALLBACK_ICON_NAME = categoryIcons[0].name;

function iconNameFor(label: string): string {
	return ICON_BY_LABEL[label] ?? FALLBACK_ICON_NAME;
}

function candidateLabels(answers: WizardAnswers): string[] {
	if (answers.style === "product") {
		return answers.domains.flatMap((domain) => PRODUCT_CANDIDATES[domain]);
	}
	if (answers.style === "room") {
		return [
			...ROOM_BASELINE,
			...answers.domains.flatMap((domain) => ROOM_ADDITIONS[domain] ?? []),
		];
	}
	return [...PROJECT_BUCKETS];
}

/**
 * Map a set of wizard answers to a concrete list of suggested categories.
 *
 * Layered construction: the selected domains drive the candidate list, `style`
 * chooses the flavour, and `comingUp` appends timely extras. The result is
 * de-duplicated by slug (same rule the backend uses) and capped at
 * `MAX_SUGGESTIONS`.
 */
export function buildSuggestions(answers: WizardAnswers): SuggestedCategory[] {
	const labels = [
		...candidateLabels(answers),
		...COMING_UP_EXTRA[answers.comingUp],
	];

	const seenSlugs = new Set<string>();
	const suggestions: SuggestedCategory[] = [];
	for (const label of labels) {
		const slug = slugify(label);
		if (!slug || seenSlugs.has(slug)) continue;
		seenSlugs.add(slug);
		suggestions.push({ label, iconName: iconNameFor(label) });
		if (suggestions.length === MAX_SUGGESTIONS) break;
	}
	return suggestions;
}
