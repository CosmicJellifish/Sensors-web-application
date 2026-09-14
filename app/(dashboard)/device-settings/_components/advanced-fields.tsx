"use client";

import type { DeviceSettings } from "../../_lib/settings";
import { SaveStatus, useSettingSave } from "./save-status";
import { SettingToggle } from "./setting-toggle";

export function AdvancedFields({ settings }: { settings: DeviceSettings }) {
  const { save, pending, status } = useSettingSave();

  return (
    <>
      <SaveStatus pending={pending} status={status} />
      <div className="p-[24px]">
        <SettingToggle
          title="Simulation Mode"
          description="Generate mock cyclic voltammetry data"
          checked={settings.simulationMode}
          disabled={pending}
          onChange={(checked) => save({ simulationMode: checked })}
        />
      </div>
    </>
  );
}
