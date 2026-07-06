// Official APAC wordmark (Supply Chain | CDMO). The PNG already contains the
// tagline, so render it alone — no duplicate text label. Explicit width/height
// (native 500×172) prevents layout shift; height is controlled via className.
export function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <img
      src="/apac-logo.png"
      alt="APAC — Supply Chain | CDMO"
      width={500}
      height={172}
      className={className}
    />
  );
}
