/**
 * Picks the projects shown on the homepage: the featured ones first, topped up
 * with other published projects so the desktop grid (`perRow` per row) never
 * ends with a half-empty row. Without featured projects, the latest ones are
 * shown instead of an empty section.
 */
export function completeRows<T extends { slug: string }>(
  featured: T[],
  all: T[],
  { perRow, max }: { perRow: number; max: number },
): T[] {
  const featuredSlugs = new Set(featured.map((item) => item.slug));
  const pool = [...featured, ...all.filter((item) => !featuredSlugs.has(item.slug))];
  const wanted = featured.length === 0 ? max : Math.ceil(featured.length / perRow) * perRow;
  return pool.slice(0, Math.min(max, wanted));
}
