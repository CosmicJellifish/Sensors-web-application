"use client";

import { useState } from "react";

import type { DeviceSettings } from "../../_lib/settings";
import { SaveError, SaveStatus, useSettingSave } from "./save-status";

const labelClass = "text-[12px] leading-[16px] font-medium text-ink-muted";

const inputClass =
  "h-[38px] w-full rounded-[4px] border border-hairline bg-canvas px-[16px] text-[14px] leading-[20px] text-ink outline-none placeholder:text-ink-subtle focus-visible:ring-2 focus-visible:ring-accent";

type LimitField = "upperLimitUa" | "lowerLimitUa";

const FIELDS: { id: string; field: LimitField; label: string }[] = [
  { id: "upper-limit", field: "upperLimitUa", label: "Upper Limit (µA)" },
  { id: "lower-limit", field: "lowerLimitUa", label: "Lower Limit (µA)" },
];

const asText = (value: number | null) => (value === null ? "" : String(value));

/**
 * These two feed Live Test's Status column, so an empty field has to mean
 * "no threshold" rather than zero — an unconfigured lower limit of 0 would
 * quietly pass every reading.
 */
export function SafetyThresholdFields({
  settings,
}: {
  settings: DeviceSettings;
}) {
  const { save, pending, status } = useSettingSave();
  const [drafts, setDrafts] = useState({
    upperLimitUa: asText(settings.upperLimitUa),
    lowerLimitUa: asText(settings.lowerLimitUa),
  });

  function commit(field: LimitField) {
    const raw = drafts[field].trim();
    const next = raw === "" ? null : Number(raw);
    if (next !== null && !Number.isFinite(next)) return;
    if (next === settings[field]) return;

    save({ [field]: next }, (saved) =>
      setDrafts({
        upperLimitUa: asText(saved.upperLimitUa),
        lowerLimitUa: asText(saved.lowerLimitUa),
      }),
    );
  }

  return (
    <>
      <SaveStatus pending={pending} status={status} />
      <div className="flex flex-col gap-[24px] p-[24px]">
        <p className="text-[14px] leading-[20px] text-ink-muted">
          Configure current warning thresholds to trigger alerts during live
          tests.
        </p>
        <div className="flex flex-col gap-[8px]">
          <div className="flex gap-[16px]">
            {FIELDS.map((entry) => (
              <div
                key={entry.id}
                className="flex min-w-0 flex-1 flex-col gap-[8px]"
              >
                <label htmlFor={entry.id} className={labelClass}>
                  {entry.label}
                </label>
                <input
                  id={entry.id}
                  name={entry.id}
                  type="number"
                  step="any"
                  placeholder="Not configured"
                  className={inputClass}
                  value={drafts[entry.field]}
                  onChange={(event) =>
                    setDrafts((current) => ({
                      ...current,
                      [entry.field]: event.target.value,
                    }))
                  }
                  onBlur={() => commit(entry.field)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur();
                  }}
                />
              </div>
            ))}
          </div>
          <SaveError status={status} />
        </div>
      </div>
    </>
  );
}
