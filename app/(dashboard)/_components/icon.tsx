type IconProps = {
  /** Path to an SVG exported from Figma, under /public/icons. */
  src: string;
  width: number;
  height: number;
  /** Tailwind background utility supplying the fill, e.g. "bg-accent". */
  className?: string;
};

/**
 * Draws one of the exported Figma SVGs through a CSS mask so its single fill
 * colour comes from CSS instead of the file. That lets the nav reuse one asset
 * for its white (resting) and black (active) states, and keeps every icon a
 * decorative element rather than a loaded <img>.
 */
export function Icon({
  src,
  width,
  height,
  className = "bg-current",
}: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`block shrink-0 ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}
