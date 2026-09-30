/**
 * The brand symbol: an isometric block assembled from three pieces — a team
 * shipping one solid product. Its faces carry the three brand colors (aqua,
 * blue, iris). Decorative: the site name is always rendered next to it.
 *
 * Flat fills (no gradients or <defs>) keep it crisp at 16px and safe to render
 * any number of times on a page.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="6 6 36 36"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path fill="#67e8f9" d="M24 7.08 37.72 15 24 22.92 10.28 15Z" />
      <path fill="#3b82f6" d="m9.35 16.62 13.72 7.92v15.84L9.35 32.46Z" />
      <path fill="#6366f1" d="m38.65 16.62-13.72 7.92v15.84l13.72-7.92Z" />
    </svg>
  );
}
