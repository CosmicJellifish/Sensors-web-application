"use client";

import { Icon } from "../../_components/icon";
import { toSearchParams } from "../_lib/export-filter";
import { useExportFilter } from "./export-filter-provider";

const downloadButtonClass =
  "flex items-center gap-[8px] bg-emerald px-[24px] py-[12px] text-[12px] leading-[16px] font-semibold tracking-[0.6px] text-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]";

/**
 * Builds its href from the shared filter rather than from the URL the page was
 * rendered with, so the file matches what the form shows even when Download is
 * clicked before the preview has finished refreshing.
 *
 * Whether there is anything to export is half server knowledge (`hasRows`, from
 * the query) and half client knowledge (the ticked variables, which can change
 * without the server having caught up).
 */
export function DownloadDataLink({ hasRows }: { hasRows: boolean }) {
  const { filter } = useExportFilter();
  const query = toSearchParams(filter).toString();
  const href = query
    ? `/data-export/download?${query}`
    : "/data-export/download";

  const icon = (
    <Icon
      src="/icons/download.svg"
      width={12}
      height={12}
      className="bg-white"
    />
  );

  if (!hasRows || filter.variables.length === 0) {
    return (
      <button
        type="button"
        disabled
        className={`${downloadButtonClass} cursor-not-allowed opacity-50`}
      >
        {icon}
        Download Data
      </button>
    );
  }

  // A plain anchor, not <Link>: this is a file download, so there is no client
  // transition to make and nothing worth prefetching.
  return (
    <a href={href} className={`${downloadButtonClass} hover:bg-[#0ea271]`}>
      {icon}
      Download Data
    </a>
  );
}
