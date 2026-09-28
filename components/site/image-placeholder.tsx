export function ImagePlaceholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`relative flex min-h-64 items-end overflow-hidden rounded-[2rem] bg-[#e8e0d5] p-6 ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.7),transparent_35%),linear-gradient(135deg,#eee8df,#ddd2c4)]" />
      <span className="relative max-w-xs text-sm font-medium text-[#5e554c]">{label}</span>
    </div>
  );
}
