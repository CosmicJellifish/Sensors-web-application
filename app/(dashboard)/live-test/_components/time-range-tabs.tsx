import Link from "next/link";

import { RANGES, type RangeId, rangeHref } from "../_lib/time-range";

/**
 * Links rather than buttons: each range is a URL, so this needs no client
 * JavaScript, works before hydration, and lets Next prefetch the other three.
 */
export function TimeRangeTabs({ selected }: { selected: RangeId }) {
  return (
    <div className="flex gap-[8px]" role="group" aria-label="Chart time range">
      {RANGES.map((range) => {
        const isSelected = range.id === selected;
        return (
          <Link
            key={range.id}
            href={rangeHref(range.id)}
            scroll={false}
            aria-current={isSelected ? "true" : undefined}
            className={
              isSelected
                ? "rounded-[4px] border border-accent bg-[rgba(0,108,73,0.1)] px-[13px] py-[5px] text-[12px] leading-[16px] font-medium text-accent"
                : "rounded-[4px] border border-hairline px-[13px] py-[5px] text-[12px] leading-[16px] font-medium text-ink-muted hover:bg-panel"
            }
          >
            {range.label}
          </Link>
        );
      })}
    </div>
  );
}
