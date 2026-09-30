import { BrandMark } from '@/components/brand/brand-mark';

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-line-strong bg-white/2 px-6 py-14 text-center">
      <BrandMark className="size-12 opacity-60" />
      <p className="max-w-md text-muted">{message}</p>
    </div>
  );
}
