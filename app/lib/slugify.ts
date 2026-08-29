/**
 * Turn a category label into its slug.
 *
 * Keep this identical to `slugify()` in `convex/categories.ts`: the wizard
 * de-duplicates suggested categories by slug on the client, and bulk creation
 * de-duplicates against existing rows on the server, so both sides must agree
 * character-for-character.
 */
export function slugify(label: string): string {
	return label
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
