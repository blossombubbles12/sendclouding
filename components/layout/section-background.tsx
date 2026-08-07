import { cn } from "@/lib/utils";

/**
 * Reusable decorative section backgrounds.
 *
 * Each variant renders a full-bleed, absolute, behind-content layer (via the
 * matching `.bg-pattern-*` CSS utility) so the pattern never captures pointer
 * events or sits above the section's own content.
 *
 * Prefer the `pattern` prop on `<Section>`; use `<SectionBackground />` directly
 * for page sections that aren't built with the `<Section>` component.
 */

export type SectionBackgroundType =
  | "radial"
  | "dots"
  | "geometric"
  | "wave"
  | "mesh"
  | "organic"
  | "splash"
  | "band";

const classByVariant: Record<SectionBackgroundType, string> = {
  radial: "bg-pattern-radial",
  dots: "bg-pattern-dots",
  geometric: "bg-pattern-geometric",
  wave: "bg-pattern-wave",
  mesh: "bg-pattern-mesh",
  organic: "bg-pattern-organic",
  splash: "bg-pattern-splash",
  band: "bg-pattern-band",
};

export interface SectionBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SectionBackgroundType;
}

export function SectionBackground({
  variant = "radial",
  className,
  ...props
}: SectionBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10",
        classByVariant[variant],
        className
      )}
      {...props}
    />
  );
}