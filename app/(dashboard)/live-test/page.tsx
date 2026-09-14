import type { Metadata } from "next";

import { Icon } from "../_components/icon";
import {
  type MeasurementId,
  MEASUREMENTS,
  forDisplay,
  formatReading,
  measurement,
} from "../_lib/measurements";
import { getDeviceSettings } from "../_lib/settings-store";
import {
  formatClock,
  formatElapsed,
  getActiveSession,
  getReadings,
  getSummary,
  readingStatus,
  recordedMeasurements,
} from "../_lib/readings";
import { TimeRangeTabs } from "./_components/time-range-tabs";
import { parseRange } from "./_lib/time-range";

export const metadata: Metadata = {
  title: "Live Test",
  description: "Real-time data acquisition workspace",
};

/**
 * Which series the Diff/Max/Min tiles describe. The card is "Current Response
 * Over Time" and the tiles carry the input current's unit, so they summarise
 * the input. One constant because the frame does not say.
 */
const STAT_MEASUREMENT: MeasurementId = "input-current";

/** Rows in the Real-time Data Stream table, matching the frame. */
const STREAM_LIMIT = 3;

// The chart palette. A view concern, so it stays out of the measurement
// catalogue; written as whole class names so Tailwind can see them.
const SERIES = {
  amber: {
    label: "Yellow",
    dot: "bg-amber",
    text: "text-amber",
    badge: "bg-[rgba(254,166,25,0.1)] border-[rgba(254,166,25,0.2)] text-amber",
  },
  emerald: {
    label: "Green",
    dot: "bg-emerald",
    text: "text-emerald",
    badge: "bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.2)] text-emerald",
  },
} as const;

const SERIES_COLOUR: Record<MeasurementId, keyof typeof SERIES> = {
  "input-current": "amber",
  "output-current": "emerald",
  temperature: "amber",
  humidity: "emerald",
};

const cardClass =
  "rounded-[8px] border border-hairline bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]";

const chipClass =
  "rounded-full border border-hairline bg-chip px-[12px] py-[5px] text-[12px] leading-[16px] font-medium text-ink-muted";

const headerCellClass =
  "px-[24px] py-[12px] text-[12px] leading-[16px] font-medium tracking-[0.6px] whitespace-nowrap text-ink-muted uppercase";

const cellClass = "px-[24px] py-[12px] text-[14px] leading-[20px]";

export default async function LiveTestPage(props: PageProps<"/live-test">) {
  const range = parseRange(await props.searchParams);
  const [session, settings] = await Promise.all([
    getActiveSession(),
    getDeviceSettings(),
  ]);

  if (!session) {
    return (
      <div className="flex flex-col gap-[24px] p-[24px]">
        <Header />
        <section className={`${cardClass} p-[25px]`}>
          <p className="text-[16px] leading-[24px] text-ink-muted">
            No test is running. Start a run from Bluetooth Devices to see live
            measurements here.
          </p>
        </section>
      </div>
    );
  }

  const [stream, latest, summary] = await Promise.all([
    getReadings({
      sessionId: session.id,
      windowMs: range.windowMs,
      limit: STREAM_LIMIT,
      newestFirst: true,
    }),
    // The run's most recent sample, which is what "elapsed" is measured to.
    getReadings({ sessionId: session.id, limit: 1, newestFirst: true }),
    getSummary(
      { sessionId: session.id, windowMs: range.windowMs },
      STAT_MEASUREMENT,
    ),
  ]);

  const newest = latest.rows[0];
  const elapsedMs = newest
    ? Date.parse(newest.recordedAt) - Date.parse(session.startedAt)
    : 0;
  // Device Settings owns how currents are displayed and what counts as an
  // alert; both arrive here rather than being re-decided per page.
  const columns = recordedMeasurements(newest).map((column) =>
    forDisplay(column, settings.currentUnit),
  );
  const statMeasurement = forDisplay(
    measurement(STAT_MEASUREMENT),
    settings.currentUnit,
  );
  const thresholds = {
    upper: settings.upperLimitUa ?? undefined,
    lower: settings.lowerLimitUa ?? undefined,
  };
  const stats = summary
    ? [
        { label: "Diff", value: summary.diff },
        { label: "Max", value: summary.max },
        { label: "Min", value: summary.min },
      ]
    : [];

  // Newest first on screen; the query returns chronological order.
  const streamRows = [...stream.rows].reverse();
  const panels = MEASUREMENTS.filter((m) => m.simulated);

  return (
    <div className="flex flex-col gap-[24px] p-[24px]">
      <header className="flex items-end justify-between">
        <div className="flex flex-col gap-[4px]">
          <h1 className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-ink">
            Live Test
          </h1>
          <p className="text-[16px] leading-[24px] text-ink-muted">
            Real-time data acquisition workspace
          </p>
          <div className="flex items-center gap-[16px] pt-[4px]">
            <span className={chipClass}>{session.solution}</span>
            <span className={chipClass}>
              Elapsed:{" "}
              <span className="font-[family-name:var(--font-geist-mono)]">
                {formatElapsed(elapsedMs)}
              </span>
            </span>
            {session.status === "recording" ? (
              <span className="flex items-center gap-[4px] rounded-full bg-[rgba(16,185,129,0.1)] px-[12px] py-[4px] text-[12px] leading-[16px] font-medium text-emerald">
                <span
                  aria-hidden="true"
                  className="size-[8px] rounded-full bg-emerald"
                />
                Recording
              </span>
            ) : (
              <span className={chipClass}>Paused</span>
            )}
          </div>
        </div>

        <div className="flex items-start gap-[12px]">
          <button
            type="button"
            className="flex items-center gap-[8px] rounded-[4px] border border-hairline bg-canvas px-[17px] py-[9px] text-[14px] leading-[20px] font-medium text-ink hover:bg-panel"
          >
            <Icon src="/icons/pause.svg" width={8.167} height={8.167} className="bg-ink" />
            Pause Test
          </button>
          <button
            type="button"
            className="flex items-center gap-[8px] rounded-[4px] bg-danger px-[16px] py-[9px] text-[14px] leading-[20px] font-medium text-white hover:bg-[#a01616]"
          >
            <Icon src="/icons/stop.svg" width={7} height={7} className="bg-white" />
            Stop Test
          </button>
        </div>
      </header>

      <section
        className={`${cardClass} flex flex-col gap-[24px] px-[25px] pt-[33px] pb-[25px]`}
      >
        <div className="flex items-center justify-between border-b border-hairline pb-[17px]">
          <h2 className="text-[20px] leading-[28px] font-semibold text-ink">
            Current Response Over Time
          </h2>
          <TimeRangeTabs selected={range.id} />
        </div>

        {stats.length > 0 ? (
          <dl className="flex gap-[32px]">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-[4px]">
                <dt className="text-[12px] leading-[16px] font-semibold tracking-[0.6px] text-ink-muted uppercase">
                  {stat.label}
                </dt>
                <dd className="flex items-baseline gap-[6px]">
                  {/* tabular-nums so a changing digit count does not shuffle
                      the tiles sideways as the run progresses. */}
                  <span className="text-[32px] leading-[40px] font-medium tracking-[-0.32px] text-ink tabular-nums">
                    {formatReading(stat.value, statMeasurement)}
                  </span>
                  <span className="text-[14px] leading-[20px] text-ink-muted">
                    {statMeasurement.unit}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-[16px] leading-[24px] text-ink-muted">
            No samples in the selected range.
          </p>
        )}

        <div className="relative flex h-[320px] items-center justify-center overflow-hidden rounded-[4px] border border-hairline bg-panel">
          <div
            aria-hidden="true"
            className="absolute inset-0 flex flex-col justify-between py-[16px] opacity-20"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="border-t border-ink-subtle" />
            ))}
          </div>
          <div className="relative flex items-center gap-[16px]">
            {(["input-current", "output-current"] as const).map((id) => {
              const series = measurement(id);
              const colour = SERIES[SERIES_COLOUR[id]];
              return (
                <span
                  key={id}
                  className="flex items-center gap-[8px] text-[16px] leading-[24px] text-ink-muted"
                >
                  <span
                    aria-hidden="true"
                    className={`size-[12px] rounded-full ${colour.dot}`}
                  />
                  {series.shortName} ({colour.label})
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <div className="flex gap-[24px]">
        {panels.map((panel) => {
          const colour = SERIES[SERIES_COLOUR[panel.id]];
          return (
            <section
              key={panel.id}
              className={`${cardClass} relative flex min-w-0 flex-1 flex-col gap-[16px] p-[25px]`}
            >
              <h2 className="border-b border-hairline pb-[9px] text-[20px] leading-[28px] font-semibold text-ink">
                {panel.name}
              </h2>
              <div className="flex h-[160px] items-center justify-center rounded-[4px] border border-hairline bg-panel">
                <p className={`text-[16px] leading-[24px] ${colour.text}`}>
                  [ {colour.label} Line Chart Placeholder ]
                </p>
              </div>
              {/* Driven by the measurement, not hard-coded per panel. */}
              <span
                className={`absolute top-[24px] right-[24px] rounded-[4px] border px-[9px] py-[5px] text-[12px] leading-[16px] font-semibold tracking-[0.6px] ${colour.badge}`}
              >
                Simulated Data
              </span>
            </section>
          );
        })}
      </div>

      <section className={`${cardClass} overflow-hidden`}>
        <h2 className="border-b border-hairline px-[24px] pt-[24px] pb-[25px] text-[20px] leading-[28px] font-semibold text-ink">
          Real-time Data Stream
        </h2>
        <table className="w-full text-left">
          <thead className="border-b border-hairline bg-panel">
            <tr>
              <th scope="col" className={headerCellClass}>
                Timestamp
              </th>
              {columns.map((column) => (
                <th key={column.id} scope="col" className={headerCellClass}>
                  {column.shortName}{" "}
                  {/* The unit is exempt from the uppercase styling: CSS maps
                      µ (U+00B5) onto Greek capital Mu, so "µA" would be
                      painted as "MA". */}
                  <span className="normal-case">({column.unit})</span>
                  {column.simulated ? (
                    <span className="sr-only"> — simulated values</span>
                  ) : null}
                </th>
              ))}
              <th scope="col" className={headerCellClass}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {streamRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="px-[24px] py-[32px] text-center text-[14px] leading-[20px] text-ink-muted"
                >
                  No samples in the selected range.
                </td>
              </tr>
            ) : (
              streamRows.map((reading) => {
                const status = readingStatus(reading, thresholds);
                return (
                  <tr
                    key={reading.id}
                    className="border-t border-hairline first:border-t-0"
                  >
                    <td
                      className={`${cellClass} text-ink font-[family-name:var(--font-geist-mono)]`}
                    >
                      {formatClock(reading.recordedAt)}
                    </td>
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={`${cellClass} tabular-nums ${
                          column.simulated ? "text-caution" : "text-ink"
                        }`}
                      >
                        {formatReading(reading.values[column.id], column)}
                        {column.simulated ? (
                          <span aria-hidden="true">*</span>
                        ) : null}
                      </td>
                    ))}
                    <td className={`${cellClass} text-ink`}>
                      <span className="flex items-center gap-[8px]">
                        <span
                          aria-hidden="true"
                          className={`size-[8px] rounded-full ${
                            status === "ok" ? "bg-emerald" : "bg-danger"
                          }`}
                        />
                        {status === "ok" ? "OK" : "Alert"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Header() {
  return (
    <header className="flex flex-col gap-[4px]">
      <h1 className="text-[36px] leading-[44px] font-bold tracking-[-0.72px] text-ink">
        Live Test
      </h1>
      <p className="text-[16px] leading-[24px] text-ink-muted">
        Real-time data acquisition workspace
      </p>
    </header>
  );
}
