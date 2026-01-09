import { cn } from "@/lib/utils";

interface PharmaIconProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export function PharmaIcon({ className, size = "md" }: PharmaIconProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm",
        sizeClasses[size],
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-2/3 h-2/3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" opacity="0.2" />
        <path d="M12 8v8" stroke="currentColor" strokeWidth="2.5" />
        <path d="M8 12h8" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    </div>
  );
}
