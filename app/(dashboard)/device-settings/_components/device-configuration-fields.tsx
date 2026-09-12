"use client";

import { useState } from "react";

import type { DeviceSettings } from "../../_lib/settings";
import { SaveStatus, useSettingSave } from "./save-status";
import { SettingToggle } from "./setting-toggle";

const labelClass = "text-[12px] leading-[16px] font-medium text-ink-muted";

const inputClass =
  "w-full rounded-[4px] border border-hairline bg-canvas px-[17px] py-[9px] text-[14px] leading-[20px] text-ink outline-none placeholder:text-ink-subtle focus-visible:ring-2 focus-visible:ring-accent";

export function DeviceConfigurationFields({
  settings,
}: {
  settings: DeviceSettings;
}) {
  const { save, pending, status } = useSettingSave();
  const [name, setName] = useState(settings.deviceName);

  function commitName() {
    if (name === settings.deviceName) return;
    save({ deviceName: name }, (saved) => setName(saved.deviceName));
  }

  return (
    <>
      <SaveStatus pending={pending} status={status} />
      <div className="flex flex-col gap-[24px] p-[24px]">
        <div className="flex flex-col gap-[8px]">
          <label htmlFor="device-name" className={labelClass}>
            Device Name
          </label>
          {/* Committed on blur, not per keystroke: a rename should not be
              written once for every character typed. */}
          <input
            id="device-name"
            name="device-name"
            type="text"
            className={inputClass}
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={commitName}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
          />
        </div>
        <div className="border-t border-hairline pt-[25px]">
          <SettingToggle
            title="Auto-reconnect"
            description="Automatically restore connection on signal loss"
            checked={settings.autoReconnect}
            disabled={pending}
            onChange={(checked) => save({ autoReconnect: checked })}
          />
        </div>
      </div>
    </>
  );
}
