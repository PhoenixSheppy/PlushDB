type Props = {
  name: string;
  logoPath: string | null;
};

export function VendorLogo({ name, logoPath }: Props) {
  return (
    <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border-subtle bg-surface-overlay">
      {logoPath ? (
        <img
          src={`/api/uploads/${logoPath}`}
          alt={`${name} logo`}
          className="max-h-full max-w-full rounded-2xl object-contain p-1.5"
        />
      ) : (
        <span className="text-2xl font-semibold text-text-muted/40">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
