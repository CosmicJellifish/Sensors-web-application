/**
 * How Data Export's filter is encoded in the URL.
 *
 * The filter lives in the query string rather than in component state so the
 * page can stay a server component: the preview table, the row count and the
 * download endpoint all read the same parsed filter, and a filtered view is a
 * shareable URL. This module is the only place that knows the encoding, so the
 * form, the page and the route handler cannot drift apart.
 *
 * What the rig measures lives in `(dashboard)/_lib/measurements`; the readings
 * themselves live in `(dashboard)/_lib/readings`. Both are shared with Live
 * Test, so neither belongs here.
 */

import {
  type MeasurementId,
  type Measurement,
  MEASUREMENTS,
} from "../../_lib/measurements";

export type ExportFormat = "csv" | "json";

export type ExportFilter = {
  sessionId: string;
  /** Inclusive, yyyy-mm-dd. */
  from: string;
  /** Inclusive, yyyy-mm-dd. */
  to: string;
  variables: MeasurementId[];
  format: ExportFormat;
};

/** Defaults reproduce the Figma frame's initial state. */
export const DEFAULT_FILTER: ExportFilter = {
  sessionId: "alpha",
  from: "2023-10-20",
  to: "2023-10-24",
  variables: ["input-current", "output-current", "temperature"],
  format: "csv",
};

/** How many rows the preview shows. The export itself is not limited. */
export const PREVIEW_LIMIT = 5;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
// Shape check only. Whether the session exists is a question for the data
// layer, but the id reaches a Content-Disposition filename, so it has to be
// known-safe before it gets that far.
const SESSION_ID = /^[a-z0-9-]{1,64}$/;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseDate(
  value: string | string[] | undefined,
  fallback: string,
): string {
  const raw = first(value);
  if (!raw || !ISO_DATE.test(raw)) return fallback;
  // Rejects things that match the shape but are not real dates (2023-13-40).
  const parsed = new Date(`${raw}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return parsed.toISOString().slice(0, 10) === raw ? raw : fallback;
}

function parseVariables(
  value: string | string[] | undefined,
): MeasurementId[] {
  const raw = first(value);
  // Absent means "untouched, use the defaults"; an empty string means the
  // operator deliberately unticked everything. They are not the same state.
  if (raw === undefined) return [...DEFAULT_FILTER.variables];
  if (raw === "") return [];
  const requested = new Set(raw.split(","));
  return MEASUREMENTS.filter((m) => requested.has(m.id)).map((m) => m.id);
}

/**
 * Turns raw query values into a filter that is safe to hand to a query.
 * Anything unrecognised falls back to the default rather than throwing, so a
 * hand-edited URL degrades to the default view instead of a 500.
 */
export function parseExportFilter(
  searchParams: Record<string, string | string[] | undefined>,
): ExportFilter {
  const sessionId = first(searchParams.session);
  const format = first(searchParams.format);
  const from = parseDate(searchParams.from, DEFAULT_FILTER.from);
  const to = parseDate(searchParams.to, DEFAULT_FILTER.to);

  return {
    sessionId:
      sessionId && SESSION_ID.test(sessionId)
        ? sessionId
        : DEFAULT_FILTER.sessionId,
    // An inverted range would silently return nothing, so normalise it here.
    from: from <= to ? from : to,
    to: from <= to ? to : from,
    variables: parseVariables(searchParams.vars),
    format: format === "json" ? "json" : "csv",
  };
}

/**
 * Inverse of {@link parseExportFilter}. Values equal to the default are left
 * out so an untouched page keeps a clean `/data-export` URL.
 */
export function toSearchParams(filter: ExportFilter): URLSearchParams {
  const params = new URLSearchParams();
  if (filter.sessionId !== DEFAULT_FILTER.sessionId) {
    params.set("session", filter.sessionId);
  }
  if (filter.from !== DEFAULT_FILTER.from) params.set("from", filter.from);
  if (filter.to !== DEFAULT_FILTER.to) params.set("to", filter.to);
  if (filter.format !== DEFAULT_FILTER.format) {
    params.set("format", filter.format);
  }
  const vars = filter.variables.join(",");
  if (vars !== DEFAULT_FILTER.variables.join(",")) params.set("vars", vars);
  return params;
}

/** The measurements selected by a filter, in table order. */
export function selectedMeasurements(filter: ExportFilter): Measurement[] {
  return MEASUREMENTS.filter((m) => filter.variables.includes(m.id));
}
