"use client";

import { useId } from "react";

type SettingToggleProps = {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

/**
 * The 44x24 pill switch used by Auto-reconnect and Simulation Mode.
 * Presentational: the card that owns it decides what persisting means.
 */
export function SettingToggle({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: SettingToggleProps) {
  const labelId = useId();
  const descriptionId = useId();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span id={labelId} className="text-[14px] leading-[20px] font-medium text-ink">
          {title}
        </span>
        <span
          id={descriptionId}
          className="text-[12px] leading-[16px] font-medium text-ink-muted"
        >
          {description}
        </span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-[24px] w-[44px] shrink-0 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-60 ${
          checked ? "bg-emerald" : "bg-track"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-[2px] size-[20px] rounded-full bg-white transition-[left] ${
            checked ? "left-[22px] border border-white" : "left-[2px] border border-hairline"
          }`}
        />
      </button>
    </div>
  );
}
