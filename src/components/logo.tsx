export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const box = size === "lg" ? "size-11 rounded-xl" : "size-7 rounded-lg";
  const icon = size === "lg" ? 24 : 16;
  return (
    <span className={`inline-flex items-center justify-center bg-accent ${box}`}>
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 18l6-6 4 4 6-8" />
      </svg>
    </span>
  );
}
