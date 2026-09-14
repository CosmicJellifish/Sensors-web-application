import type { NextRequest } from "next/server";

import {
  parseExportFilter,
  selectedMeasurements,
} from "../_lib/export-filter";
import { forDisplay, toDisplayValue } from "../../_lib/measurements";
import {
  formatTimestamp,
  getReadings,
  getSession,
} from "../../_lib/readings";
import { getDeviceSettings } from "../../_lib/settings-store";

/**
 * Serves the current filter as a file. It reads the same query string the page
 * does and runs it through the same parser, so what downloads is always what
 * the preview showed — there is no second copy of the filter to keep in sync.
 *
 * Route handlers are not cached by default, and this one reads the request URL,
 * so every hit re-runs the query.
 */

function csvCell(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export async function GET(request: NextRequest) {
  const filter = parseExportFilter(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  const settings = await getDeviceSettings();
  // Exported in the unit the operator picked; the header says which, and the
  // values keep full precision rather than the table's rounding.
  const columns = selectedMeasurements(filter).map((column) =>
    forDisplay(column, settings.currentUnit),
  );

  if (columns.length === 0) {
    return new Response("Select at least one measurement variable.", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const [{ rows }, session] = await Promise.all([
    getReadings({
      sessionId: filter.sessionId,
      from: filter.from,
      to: filter.to,
    }),
    getSession(filter.sessionId),
  ]);
  const filename = `sensor-export-${filter.sessionId}-${filter.from}_${filter.to}.${filter.format}`;

  let body: string;
  let contentType: string;

  if (filter.format === "json") {
    // The structured form: units and the simulated flag travel as metadata
    // rather than being encoded into the values.
    body = JSON.stringify(
      {
        session: {
          id: filter.sessionId,
          label: session?.label ?? filter.sessionId,
        },
        range: { from: filter.from, to: filter.to },
        measurements: columns.map(({ id, name, unit, simulated }) => ({
          id,
          name,
          unit,
          simulated,
        })),
        readings: rows.map((reading) => ({
          id: reading.id,
          recordedAt: reading.recordedAt,
          values: Object.fromEntries(
            columns.map((m) => {
              const value = reading.values[m.id];
              return [m.id, value === undefined ? null : toDisplayValue(value, m)];
            }),
          ),
        })),
      },
      null,
      2,
    );
    contentType = "application/json; charset=utf-8";
  } else {
    // The spreadsheet form: headers read like the on-screen columns, and
    // simulated columns say so in the header instead of per cell, so every
    // value stays a clean number.
    const header = [
      "Timestamp",
      ...columns.map(
        (m) => `${m.shortName} (${m.unit})${m.simulated ? " [simulated]" : ""}`,
      ),
    ];
    const lines = [
      header.map(csvCell).join(","),
      ...rows.map((reading) =>
        [
          formatTimestamp(reading.recordedAt),
          ...columns.map((m) => {
            const value = reading.values[m.id];
            return value === undefined
              ? ""
              : String(toDisplayValue(value, m));
          }),
        ]
          .map(csvCell)
          .join(","),
      ),
    ];
    // BOM so Excel reads the µ and ° in the headers as UTF-8.
    body = `\uFEFF${lines.join("\r\n")}\r\n`;
    contentType = "text/csv; charset=utf-8";
  }

  return new Response(body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
