"use client";

import type {
  DisplayMeasurement,
  MeasurementId,
} from "../../_lib/measurements";
import type { Session } from "../../_lib/readings";
import type { ExportFormat } from "../_lib/export-filter";
import { useExportFilter } from "./export-filter-provider";

// Figma renders these as native browser controls, so they are reproduced as
// real inputs and tinted with accent-color rather than rebuilt from the
// exported checkmark/radio/chevron images.
const fieldClass =
  "w-full border border-hairline bg-white px-[13px] py-[9px] text-[14px] leading-[20px] text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent";

const dateClass =
  "min-w-0 flex-1 border border-hairline bg-white px-[9px] py-[5px] text-[14px] leading-[20px] text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent";

const labelClass = "text-[12px] leading-[16px] font-medium text-ink-muted";

/**
 * Every control writes straight to the shared filter, which writes straight to
 * the query string; nothing is mirrored in local state here. That is what lets
 * the preview table and the download link — neither of them inside this
 * component — see the same filter.
 */
export function ExportParametersForm({
  sessions,
  measurements,
}: {
  sessions: Session[];
  /** In display units, so the checkbox labels match the preview headings. */
  measurements: DisplayMeasurement[];
}) {
  const { filter, apply, isPending } = useExportFilter();

  function toggleVariable(id: MeasurementId, checked: boolean) {
    apply({
      variables: checked
        ? [...filter.variables, id]
        : filter.variables.filter((value) => value !== id),
    });
  }

  return (
    <form
      className="flex flex-col gap-[16px]"
      aria-busy={isPending}
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex flex-col gap-[4px]">
        <label htmlFor="test-session" className={labelClass}>
          Test Session
        </label>
        <select
          id="test-session"
          name="session"
          className={fieldClass}
          value={filter.sessionId}
          onChange={(event) => apply({ sessionId: event.target.value })}
        >
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="flex flex-col gap-[4px]">
        <legend className={labelClass}>Date Range</legend>
        <div className="flex items-center gap-[8px]">
          {/* An empty value means the picker is mid-edit, so hold the commit
              until there is a whole date. `max`/`min` keep the two ends from
              crossing; parseExportFilter re-checks that server-side. */}
          <input
            type="date"
            name="from"
            aria-label="Start date"
            className={dateClass}
            value={filter.from}
            max={filter.to}
            onChange={(event) => {
              if (event.target.value) apply({ from: event.target.value });
            }}
          />
          <span className="text-[14px] leading-[20px] text-ink-muted">to</span>
          <input
            type="date"
            name="to"
            aria-label="End date"
            className={dateClass}
            value={filter.to}
            min={filter.from}
            onChange={(event) => {
              if (event.target.value) apply({ to: event.target.value });
            }}
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-[8px]">
        <legend className={`${labelClass} pb-[8px]`}>
          Measurement Variables
        </legend>
        {measurements.map((measurement) => (
          <label
            key={measurement.id}
            htmlFor={measurement.id}
            className="flex items-center gap-[8px] text-[14px] leading-[20px] whitespace-nowrap text-ink"
          >
            <input
              id={measurement.id}
              name="vars"
              type="checkbox"
              value={measurement.id}
              checked={filter.variables.includes(measurement.id)}
              onChange={(event) =>
                toggleVariable(measurement.id, event.target.checked)
              }
              className="size-[16px] accent-accent"
            />
            {measurement.name} ({measurement.unit})
            {measurement.simulated ? (
              <span className="text-[12px] leading-[16px] text-caution italic">
                (Simulated)
              </span>
            ) : null}
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-[8px]">
        <legend className={`${labelClass} pb-[8px]`}>Export Format</legend>
        <div className="flex items-center gap-[24px]">
          {(["csv", "json"] as const).map((option) => (
            <label
              key={option}
              htmlFor={`format-${option}`}
              className="flex items-center gap-[8px] text-[14px] leading-[20px] text-ink"
            >
              <input
                id={`format-${option}`}
                name="format"
                type="radio"
                value={option}
                checked={filter.format === option}
                onChange={() => apply({ format: option as ExportFormat })}
                className="size-[16px] accent-accent"
              />
              {option.toUpperCase()}
            </label>
          ))}
        </div>
      </fieldset>

      {/* The preview updates silently otherwise, which a screen reader cannot
          see. Kept out of the layout so the card height does not shift. */}
      <p aria-live="polite" className="sr-only">
        {isPending ? "Updating preview…" : ""}
      </p>
    </form>
  );
}
