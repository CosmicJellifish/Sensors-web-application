/**
 * The seam the database will slot into, shared by Live Test and Data Export.
 *
 * Every reader is already async and already takes a query rather than reaching
 * for a module-level array, so swapping the mock generator at the bottom for a
 * real query is a change inside this file only. The row shape is the shape a
 * query should return, not the shape a table happens to render:
 *
 *   - values are numbers, not pre-formatted strings; rounding lives with the
 *     Measurement's `precision`
 *   - "simulated" is a property of the measurement, not an asterisk glued onto
 *     a value, so rows stay sortable, filterable and exportable
 *   - there is one canonical instant per row; the ISO stamp on Data Export and
 *     the wall clock on Live Test are two views of it
 *   - rows carry an id, so a live table keys on identity rather than on a
 *     timestamp that repeats as soon as the sample rate outruns its resolution
 */

import {
  type MeasurementId,
  MEASUREMENTS,
  measurement,
} from "./measurements";

export type SessionStatus = "recording" | "paused" | "complete";

export type Session = {
  id: string;
  label: string;
  /** What is on the electrode for this run. */
  solution: string;
  status: SessionStatus;
  /** First sample, ISO-8601 with offset. */
  startedAt: string;
  /** Sampling period. Live Test runs faster than the archived sessions. */
  sampleIntervalMs: number;
  sampleCount: number;
};

export type SensorReading = {
  /** Stable row identity. A real row will use the database primary key. */
  id: string;
  /** One canonical instant, ISO-8601 with offset. Formatting is a view concern. */
  recordedAt: string;
  /** Absent when a measurement was not recorded for this row. */
  values: Partial<Record<MeasurementId, number>>;
};

export type ReadingPage = {
  /** Chronological, oldest first. Views that want newest-first reverse it. */
  rows: SensorReading[];
  /** Rows matching the query, which is not the number of rows returned. */
  total: number;
};

// --- views on a stored instant ---------------------------------------------
// Deliberately not locale-aware: rendering the operator's local time on the
// server would disagree with the client after hydration.

/**
 * `2023-10-24T10:00:01Z` — the archival form Data Export shows.
 *
 * Milliseconds are dropped only when they are zero. Trimming them
 * unconditionally reads better at 1 Hz and silently collapses every pair of
 * rows in a 2 Hz export onto one timestamp.
 */
export function formatTimestamp(recordedAt: string): string {
  return recordedAt.replace(/\.000Z$/, "Z");
}

/** `10:42:15.00` — the wall clock Live Test shows. */
export function formatClock(recordedAt: string): string {
  const time = recordedAt.slice(11, 22); // HH:MM:SS.mmm
  return `${time.slice(0, 8)}.${time.slice(9, 11)}`;
}

/** `00:15:30` */
export function formatElapsed(milliseconds: number): string {
  const total = Math.max(0, Math.floor(milliseconds / 1000));
  return [Math.floor(total / 3600), Math.floor(total / 60) % 60, total % 60]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

// --- summaries -------------------------------------------------------------

export type Summary = { min: number; max: number; diff: number };

/**
 * Live Test's Diff/Max/Min tiles. They are derived here rather than stored
 * because they are a property of the window on screen, not of any one row —
 * the Figma frame lists them as three unrelated literals whose Diff does not
 * equal its own Max minus Min.
 *
 * If "Diff" is meant to be something else (input minus output at the latest
 * sample, say) this is the one place that has to change.
 */
export function summarise(
  readings: SensorReading[],
  id: MeasurementId,
): Summary | null {
  const values = readings
    .map((reading) => reading.values[id])
    .filter((value): value is number => value !== undefined);
  if (values.length === 0) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  return { min, max, diff: max - min };
}

export type Thresholds = { upper?: number; lower?: number };

/**
 * The Status column on Live Test. Device Settings offers upper/lower current
 * limits described as triggering "alerts during live tests" — this is where
 * they land once that page can persist them. With none configured every
 * reading is nominal, which is what the frame shows.
 */
export function readingStatus(
  reading: SensorReading,
  thresholds: Thresholds = {},
): "ok" | "alert" {
  const value = reading.values["input-current"];
  if (value === undefined) return "ok";
  if (thresholds.upper !== undefined && value > thresholds.upper) return "alert";
  if (thresholds.lower !== undefined && value < thresholds.lower) return "alert";
  return "ok";
}

// --- mock source -----------------------------------------------------------
// Deterministic on purpose: no Date.now(), no Math.random(), so a given URL
// always renders the same page. The waveforms are the values in the frames.

type Waveform = Record<MeasurementId, number>[];

// Output values sit on the 0.1 µA grid. Data Export's frame shows them at 2dp
// (1.02, 0.98), which the rig cannot resolve; the shape is kept, the invented
// digit is not.
const ARCHIVE_WAVEFORM: Waveform = [
  { "input-current": 12.4, "output-current": 1.0, temperature: 22.1, humidity: 45.2 },
  { "input-current": 12.5, "output-current": 1.1, temperature: 22.1, humidity: 45.2 },
  { "input-current": 12.3, "output-current": 0.9, temperature: 22.2, humidity: 45.3 },
  { "input-current": 12.6, "output-current": 1.1, temperature: 22.2, humidity: 45.1 },
  { "input-current": 12.4, "output-current": 1.0, temperature: 22.3, humidity: 45.4 },
];

// Read bottom-up: Live Test shows the newest three, which are the last three
// here, and they are the three rows in the frame.
const LIVE_WAVEFORM: Waveform = [
  { "input-current": 12.1, "output-current": 11.8, temperature: 22.3, humidity: 45.3 },
  { "input-current": 12.2, "output-current": 11.7, temperature: 22.4, humidity: 45.2 },
  { "input-current": 12.1, "output-current": 11.8, temperature: 22.4, humidity: 45.2 },
];

/**
 * A run drifts as the electrode fouls. Without it every time range over the
 * same session would return identical Min/Max and the range selector would
 * look decorative even though it is driving the query.
 */
type MockSession = Session & { waveform: Waveform; driftPerSample?: number };

const SESSION_ROWS: readonly MockSession[] = [
  {
    id: "alpha",
    label: "Session Alpha (2023-10-24 10:00)",
    solution: "Phosphate Buffer",
    status: "complete",
    startedAt: "2023-10-24T10:00:00Z",
    sampleIntervalMs: 1000,
    sampleCount: 240,
    waveform: ARCHIVE_WAVEFORM,
  },
  {
    id: "beta",
    label: "Session Beta (2023-10-25 09:30)",
    solution: "Phosphate Buffer",
    status: "complete",
    startedAt: "2023-10-25T09:30:00Z",
    sampleIntervalMs: 1000,
    sampleCount: 240,
    waveform: ARCHIVE_WAVEFORM,
  },
  {
    id: "gamma",
    label: "Session Gamma (2023-10-24 10:26)",
    solution: "Simulated Sweat Solution",
    status: "recording",
    startedAt: "2023-10-24T10:26:45Z",
    // 2 Hz for 15m30s, ending at 10:42:15 — the frame's clock.
    sampleIntervalMs: 500,
    sampleCount: 1860,
    waveform: LIVE_WAVEFORM,
    // Drifts down to zero at the newest sample, so the last three rows are
    // exactly the frame's and older samples sit higher.
    driftPerSample: 0.0005,
  },
];

/** Strips the mock waveform so callers only ever see the public shape. */
function toSession(row: MockSession): Session {
  return {
    id: row.id,
    label: row.label,
    solution: row.solution,
    status: row.status,
    startedAt: row.startedAt,
    sampleIntervalMs: row.sampleIntervalMs,
    sampleCount: row.sampleCount,
  };
}

function generate(row: MockSession): SensorReading[] {
  const start = Date.parse(row.startedAt);
  return Array.from({ length: row.sampleCount }, (_, index) => {
    const sample = row.waveform[index % row.waveform.length];
    const drift = (row.driftPerSample ?? 0) * (row.sampleCount - 1 - index);
    return {
      id: `${row.id}-${index}`,
      recordedAt: new Date(
        start + (index + 1) * row.sampleIntervalMs,
      ).toISOString(),
      values: {
        ...sample,
        "input-current": quantise(sample["input-current"] + drift),
        "output-current": quantise(sample["output-current"] + drift),
      },
    };
  });
}

/**
 * The rig resolves current to 0.1 µA, so a stored reading never carries a digit
 * finer than that. Applied here rather than at render time: rounding on the way
 * out would still let the raw CSV export claim precision the instrument does
 * not have.
 */
const CURRENT_RESOLUTION_UA = 0.1;

function quantise(value: number): number {
  const stepped = Math.round(value / CURRENT_RESOLUTION_UA) * CURRENT_RESOLUTION_UA;
  return Number(stepped.toFixed(4)); // clears the float noise the division adds
}

// --- queries ---------------------------------------------------------------

export async function getSessions(): Promise<Session[]> {
  return SESSION_ROWS.map(toSession);
}

export async function getSession(id: string): Promise<Session | null> {
  const row = SESSION_ROWS.find((session) => session.id === id);
  return row ? toSession(row) : null;
}

/** The run Live Test is watching. Null when the rig is idle. */
export async function getActiveSession(): Promise<Session | null> {
  const row = SESSION_ROWS.find((session) => session.status === "recording");
  return row ? toSession(row) : null;
}

export type ReadingQuery = {
  sessionId: string;
  /** Inclusive, yyyy-mm-dd. Omit for the whole session. */
  from?: string;
  to?: string;
  /** Keep only the last N milliseconds of the session. */
  windowMs?: number;
  /** Maximum rows to return; `total` still reports the full match. */
  limit?: number;
  /** Return the newest rows rather than the oldest when limiting. */
  newestFirst?: boolean;
};

export async function getReadings(query: ReadingQuery): Promise<ReadingPage> {
  const row = SESSION_ROWS.find((session) => session.id === query.sessionId);
  if (!row) return { rows: [], total: 0 };

  let readings = generate(row);

  if (query.from || query.to) {
    // Inclusive of the whole `to` day, which is what a date picker implies.
    const fromMs = query.from
      ? Date.parse(`${query.from}T00:00:00Z`)
      : -Infinity;
    const toMs = query.to ? Date.parse(`${query.to}T23:59:59.999Z`) : Infinity;
    readings = readings.filter((reading) => {
      const at = Date.parse(reading.recordedAt);
      return at >= fromMs && at <= toMs;
    });
  }

  if (query.windowMs !== undefined && readings.length > 0) {
    const latest = Date.parse(readings[readings.length - 1].recordedAt);
    const floor = latest - query.windowMs;
    readings = readings.filter(
      (reading) => Date.parse(reading.recordedAt) >= floor,
    );
  }

  const total = readings.length;
  const rows =
    query.limit === undefined
      ? readings
      : query.newestFirst
        ? readings.slice(-query.limit)
        : readings.slice(0, query.limit);

  return { rows, total };
}

/**
 * Aggregate over a query without pulling the rows across. Today that is a
 * filter plus {@link summarise}; against a real table it is one
 * `SELECT MIN(...), MAX(...)`, which is why the page asks for this rather than
 * fetching a 15-minute window and reducing it in the view.
 */
export async function getSummary(
  query: ReadingQuery,
  id: MeasurementId,
): Promise<Summary | null> {
  const { rows } = await getReadings({ ...query, limit: undefined });
  return summarise(rows, id);
}

/** Measurements a session actually recorded, in table order. */
export function recordedMeasurements(reading: SensorReading | undefined) {
  if (!reading) return [];
  return MEASUREMENTS.filter((m) => reading.values[m.id] !== undefined).map(
    (m) => measurement(m.id),
  );
}
