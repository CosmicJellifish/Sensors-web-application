/**
 * The chart's time range, encoded in the URL for the same reason Data Export's
 * filter is: the stats tiles and the data stream are rendered on the server, so
 * the selector cannot own this in local state without them going blind to it.
 *
 * In the Figma frame these four buttons drive nothing — 15m is simply the one
 * drawn as selected.
 */

export const RANGES = [
  { id: "1m", label: "1m", windowMs: 60_000 },
  { id: "5m", label: "5m", windowMs: 5 * 60_000 },
  { id: "15m", label: "15m", windowMs: 15 * 60_000 },
  /** The whole run. */
  { id: "full", label: "Full", windowMs: undefined },
] as const;

export type TimeRange = (typeof RANGES)[number];
export type RangeId = TimeRange["id"];

export const DEFAULT_RANGE: RangeId = "15m";

export function parseRange(
  searchParams: Record<string, string | string[] | undefined>,
): TimeRange {
  const raw = Array.isArray(searchParams.range)
    ? searchParams.range[0]
    : searchParams.range;
  return (
    RANGES.find((range) => range.id === raw) ??
    // Non-null: DEFAULT_RANGE is one of RANGES by construction.
    RANGES.find((range) => range.id === DEFAULT_RANGE)!
  );
}

/** Default range keeps a clean `/live-test` URL. */
export function rangeHref(id: RangeId): string {
  return id === DEFAULT_RANGE ? "/live-test" : `/live-test?range=${id}`;
}
