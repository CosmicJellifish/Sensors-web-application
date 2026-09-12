"use client";

import {
  type CurrentUnit,
  type DeviceSettings,
  SAMPLING_RATES,
} from "../../_lib/settings";
import { SaveStatus, useSettingSave } from "./save-status";

const labelClass = "text-[12px] leading-[16px] font-medium text-ink-muted";

const inputClass =
  "w-full rounded-[4px] border border-hairline bg-canvas px-[17px] py-[9px] text-[14px] leading-[20px] text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent";

const UNITS: { value: CurrentUnit; label: string }[] = [
  { value: "µA", label: "Microamps (µA)" },
  { value: "nA", label: "Nanoamps (nA)" },
];

export function MeasurementPrefsFields({
  settings,
}: {
  settings: DeviceSettings;
}) {
  const { save, pending, status } = useSettingSave();

  return (
    <>
      <SaveStatus pending={pending} status={status} />
      <div className="flex flex-col gap-[24px] p-[24px] pb-[38px]">
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="sampling-rate" className={labelClass}>
            Sampling Rate (Hz)
          </label>
          <select
            id="sampling-rate"
            name="sampling-rate"
            className={inputClass}
            value={settings.samplingRateHz}
            disabled={pending}
            onChange={(event) =>
              save({ samplingRateHz: Number(event.target.value) })
            }
          >
            {SAMPLING_RATES.map((rate) => (
              <option key={rate.value} value={rate.value}>
                {rate.label}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="flex flex-col gap-[12px]">
          <legend className={`${labelClass} pb-[12px]`}>
            Measurement Units
          </legend>
          <div className="flex items-center gap-[24px]">
            {UNITS.map((option) => (
              <label
                key={option.value}
                htmlFor={`unit-${option.value}`}
                className="flex items-center gap-[8px] text-[14px] leading-[20px] text-ink"
              >
                <input
                  id={`unit-${option.value}`}
                  name="measurement-unit"
                  type="radio"
                  value={option.value}
                  checked={settings.currentUnit === option.value}
                  disabled={pending}
                  onChange={() => save({ currentUnit: option.value })}
                  className="size-[16px] accent-emerald"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </>
  );
}
