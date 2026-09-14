import type { Metadata } from "next";

import { Icon } from "../_components/icon";
import { getDeviceSettings } from "../_lib/settings-store";
import { AdvancedFields } from "./_components/advanced-fields";
import { DeviceConfigurationFields } from "./_components/device-configuration-fields";
import { MeasurementPrefsFields } from "./_components/measurement-prefs-fields";
import { SafetyThresholdFields } from "./_components/safety-threshold-fields";

export const metadata: Metadata = {
  title: "Device Settings",
  description: "Configure the connected sensor, measurement preferences, and firmware.",
};

// `relative` so each card's save indicator can sit in the empty right-hand half
// of its header without the fields below it moving when it appears.
const cardClass =
  "relative flex flex-col rounded-[8px] border border-hairline bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]";

const cardHeaderClass =
  "flex items-center gap-[8px] border-b border-hairline px-[24px] pt-[16px] pb-[17px] text-[20px] leading-[28px] font-semibold text-ink";

/** Reported by the device, not configurable, so it is plain server markup. */
const FIRMWARE_FACTS = [
  { label: "Current Version", value: "v2.1.0-stable" },
  { label: "Serial Number", value: "ESM-8839-X2" },
];

export default async function DeviceSettingsPage() {
  const settings = await getDeviceSettings();

  return (
    <div className="max-w-[1280px] px-[24px] pt-[24px] pb-[228px]">
      {/* The Figma frame has no visible page title, so this keeps the screen
          reachable by heading order without changing the layout. */}
      <h1 className="sr-only">Device Settings</h1>

      <div className="grid grid-cols-2 items-stretch gap-[20px]">
        <section className={`${cardClass} self-start`}>
          <h2 className={cardHeaderClass}>
            <Icon src="/icons/chip.svg" width={15} height={15} className="bg-accent" />
            Device Configuration
          </h2>
          <DeviceConfigurationFields settings={settings} />
        </section>

        <section className={`${cardClass} self-start`}>
          <h2 className={cardHeaderClass}>
            <Icon src="/icons/sliders.svg" width={15} height={15} className="bg-accent" />
            Measurement Prefs
          </h2>
          <MeasurementPrefsFields settings={settings} />
        </section>

        <section className={cardClass}>
          <h2 className={cardHeaderClass}>
            <Icon
              src="/icons/warning.svg"
              width={18.333}
              height={15.833}
              className="bg-danger"
            />
            Safety &amp; Thresholds
          </h2>
          <SafetyThresholdFields settings={settings} />
        </section>

        <div className="flex flex-col gap-[20px]">
          <section className={cardClass}>
            <h2 className={cardHeaderClass}>
              <Icon
                src="/icons/firmware.svg"
                width={16.667}
                height={13.333}
                className="bg-accent"
              />
              Firmware Info
            </h2>
            <div className="flex flex-col gap-[16px] p-[24px]">
              <dl className="flex flex-col gap-[16px]">
                {FIRMWARE_FACTS.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-center justify-between border-b border-dashed border-hairline pt-[8px] pb-[9px]"
                  >
                    <dt className="text-[12px] leading-[16px] font-medium text-ink-muted">
                      {fact.label}
                    </dt>
                    <dd className="text-[14px] leading-[20px] font-medium text-ink">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="pt-[8px]">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-[8px] rounded-[4px] border border-hairline bg-canvas px-[17px] py-[9px] text-[14px] leading-[20px] text-ink hover:bg-panel"
                >
                  <Icon src="/icons/refresh.svg" width={12} height={12} className="bg-ink" />
                  Check for Updates
                </button>
              </div>
            </div>
          </section>

          <section className={cardClass}>
            <h2 className={cardHeaderClass}>
              <Icon src="/icons/wrench.svg" width={15} height={15} className="bg-caution" />
              Advanced
            </h2>
            <AdvancedFields settings={settings} />
          </section>
        </div>
      </div>
    </div>
  );
}
