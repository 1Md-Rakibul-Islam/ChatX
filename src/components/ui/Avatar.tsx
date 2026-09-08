type AvatarTone = "primary" | "success" | "warning";
type AvatarSize = "sm" | "md";

const toneClasses: Record<AvatarTone, string> = {
  primary: "bg-primary text-primary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
};

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-7 w-7 text-[0.6rem]",
  md: "h-9 w-9 text-xs",
};

export function Avatar({
  initials,
  tone = "primary",
  size = "md",
}: {
  initials: string;
  tone?: AvatarTone;
  size?: AvatarSize;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold flex-shrink-0 border-2 border-card ${toneClasses[tone]} ${sizeClasses[size]}`}
    >
      {initials}
    </span>
  );
}
