export function ShipIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M16 3 28 28 16 21 4 28Z" />
      <path d="M16 9v10" />
    </svg>
  );
}
