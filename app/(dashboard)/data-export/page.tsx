import type { Metadata } from "next";

import { Icon } from "../_components/icon";
import { ExportParametersForm } from "./_components/export-parameters-form";
import {
  PREVIEW_LIMIT,
  parseExportFilter,
  selectedMeasurements,
  toSearchParams,
} from "./_lib/export-filter";
import {
  MEASUREMENTS,
  forDisplay,
  formatReading,
} from "../_lib/measurements";
import { formatTimestamp, getReadings, getSessions } from "../_lib/readings";
import { getDeviceSettings } from "../_lib/settings-store";

export const metadata: Metadata = {
  title: "Data Export",
  description: "Extract and format precision sensor data for external analysis.",
};

const headerCellClass =
  "px-[12px] pt-[7.5px] pb-[9.5px] text-[12px] leading-[16px] font-semibold tracking-[0.6px] whitespace-nowrap text-ink-muted";

// Colour is applied per cell (simulated columns are amber), so it is
// deliberately left out of the shared cell class.
const cellClass =
  "px-[12px] py-[12.5px] text-[14px] leading-[20px] whitespace-nowrap font-[family-name:var(--font-geist-mono)]";

const downloadButtonClass =
  "flex items-center gap-[8px] bg-emerald px-[24px] py-[12px] text-[12px] leading-[16px] font-semibold tracking-[0.6px] text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]";

const emptyStateClass =
  "px-[12px] py-[32px] text-center text-[14px] leading-[20px] text-ink-muted";

export default async function DataExportPage(
  props: PageProps<"/data-export">,
) {
  const filter = parseExportFilter(await props.searchParams);
  const settings = await getDeviceSettings();
  // The µA/nA preference from Device Settings applies here too, so the preview
  // and the file agree with what the operator selected there.
  const columns = selectedMeasurements(filter).map((column) =>
    forDisplay(column, settings.currentUnit),
  );
  const [{ rows, total }, sessions] = await Promise.all([
    getReadings({
      sessionId: filter.sessionId,
      from: filter.from,
      to: filter.to,
      limit: PREVIEW_LIMIT,
    }),
    getSessions(),
  ]);

  const canDownload = columns.length > 0 && total > 0;
  const downloadQuery = toSearchParams(filter).toString();
  const downloadHref = downloadQuery
    ? `/data-export/download?${downloadQuery}`
    : "/data-export/download";

  // Describes what the table is actually showing, which is not the same as the
  // number of matching rows once every variable has been unticked.
  const previewSummary =
    columns.length === 0
      ? "No variables selected"
      : total === 0
        ? "No rows"
        : `${rows.length} of ${total} rows shown`;

  return (
    <div className="p-[24px]">
      <div className="flex w-full max-w-[1152px] flex-col gap-[16px]">
        <header className="flex flex-col gap-[4px] border-b border-hairline pb-[9px]">
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.24px] text-ink">
            Data Export
          </h1>
          <p className="text-[14px] leading-[20px] text-ink-muted">
            Extract and format precision sensor data for external analysis.
          </p>
        </header>

        <div className="grid grid-cols-12 items-start gap-[16px]">
          <div className="col-span-4 flex flex-col gap-[20px]">
            <section className="flex flex-col gap-[8px] border border-hairline bg-white p-[17px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
              <h2 className="border-b border-hairline pb-[5px] text-[20px] leading-[28px] font-semibold text-ink">
                Export Parameters
              </h2>
              <ExportParametersForm
                filter={filter}
                sessions={sessions}
                measurements={MEASUREMENTS.map((m) =>
                  forDisplay(m, settings.currentUnit),
                )}
              />
            </section>

            <aside className="flex gap-[12px] border border-hairline border-l-4 border-l-caution bg-panel py-[9px] pr-[9px] pl-[12px]">
              <Icon src="/icons/info.svg" width={20} height={20} className="bg-caution" />
              <p className="text-[14px] leading-[20px] text-ink-muted">
                Simulated environmental values will be flagged in export.
              </p>
            </aside>
          </div>

          <section className="col-span-8 overflow-hidden border border-hairline bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between border-b border-hairline bg-canvas px-[16px] pt-[16px] pb-[17px]">
              <h2 className="text-[20px] leading-[28px] font-semibold text-ink">
                Data Preview
              </h2>
              <span className="rounded-[2px] bg-chip px-[8px] py-[4px] text-[12px] leading-[16px] font-medium text-ink-muted">
                {previewSummary}
              </span>
            </div>

            <div className="px-[16px] pt-[16px] pb-[59px]">
              {columns.length === 0 ? (
                <p className={emptyStateClass}>
                  Select at least one measurement variable to preview data.
                </p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-hairline">
                      <th scope="col" className={`${headerCellClass} text-left`}>
                        Timestamp
                      </th>
                      {columns.map((measurement) => (
                        <th
                          key={measurement.id}
                          scope="col"
                          className={`${headerCellClass} text-right`}
                        >
                          {measurement.shortName} ({measurement.unit})
                          {/* The asterisk on each value is decorative; say what
                              it means once, where the column is announced. */}
                          {measurement.simulated ? (
                            <span className="sr-only"> — simulated values</span>
                          ) : null}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns.length + 1}
                          className={emptyStateClass}
                        >
                          No readings in this date range for this session.
                        </td>
                      </tr>
                    ) : (
                      rows.map((reading) => (
                        <tr
                          key={reading.id}
                          className="border-b border-hairline last:border-b-0"
                        >
                          <td className={`${cellClass} text-left text-ink`}>
                            {formatTimestamp(reading.recordedAt)}
                          </td>
                          {columns.map((measurement) => (
                            <td
                              key={measurement.id}
                              className={`${cellClass} text-right ${
                                measurement.simulated
                                  ? "text-caution"
                                  : "text-ink"
                              }`}
                            >
                              {formatReading(
                                reading.values[measurement.id],
                                measurement,
                              )}
                              {measurement.simulated ? (
                                <span aria-hidden="true">*</span>
                              ) : null}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex justify-end border-t border-hairline bg-panel px-[16px] pt-[17px] pb-[16px]">
              {canDownload ? (
                // A plain anchor, not <Link>: this is a file download, so there
                // is no client transition to make and nothing worth prefetching.
                <a
                  href={downloadHref}
                  className={`${downloadButtonClass} hover:bg-[#0ea271]`}
                >
                  <Icon src="/icons/download.svg" width={12} height={12} className="bg-white" />
                  Download Data
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className={`${downloadButtonClass} cursor-not-allowed opacity-50`}
                >
                  <Icon src="/icons/download.svg" width={12} height={12} className="bg-white" />
                  Download Data
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
