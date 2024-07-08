export function generateSlug(text: string): string {
	return text
		.normalize("NFD") // Normal Form Decomposed
		.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
		.toLowerCase() // Lowercase
		.replace(/[^\w\s-]/g, "") // Remove non-word characters
		.replace(/[\s+]+/g, "-") // Replace spaces with hyphens
}
