import Image from "next/image";
import Link from "next/link";
import { APP_LOGO_URL, APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { box: "h-9 w-9", image: 36 },
  md: { box: "h-12 w-12", image: 48 },
  lg: { box: "h-24 w-24 sm:h-28 sm:w-28", image: 112 },
  xl: { box: "h-32 w-32 sm:h-40 sm:w-40", image: 160 },
} as const;

interface LogoProps {
  size?: keyof typeof SIZES;
  showName?: boolean;
  href?: string;
  className?: string;
  nameClassName?: string;
}

export function Logo({
  size = "md",
  showName = true,
  href = "/",
  className,
  nameClassName,
}: LogoProps) {
  const { box, image } = SIZES[size];

  const content = (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
          box,
        )}
      >
        <Image
          src={APP_LOGO_URL}
          alt={`${APP_NAME} logo`}
          width={image}
          height={image}
          className="h-full w-full object-cover"
          priority={size === "lg" || size === "xl"}
        />
      </div>
      {showName && (
        <span
          className={cn(
            "font-bold tracking-[0.18em] text-foreground",
            size === "sm" ? "text-sm" : size === "md" ? "text-lg" : "sr-only",
            nameClassName,
          )}
        >
          {APP_NAME}
        </span>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="transition-opacity hover:opacity-90">
      {content}
    </Link>
  );
}