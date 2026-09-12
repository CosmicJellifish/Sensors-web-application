/**
 * Device settings, and the one place that decides what a valid setting is.
 *
 * Unlike Data Export's filter and Live Test's range, these are not view state,
 * so they do not belong in the URL — they are durable configuration that has to
 * survive a reload and be readable from any page. Today they live in a cookie;
 * `getDeviceSettings` and `updateDeviceSettings` are the seam, so moving them
 * onto the device record is a change inside this file and ./settings-store.
 *
 * This module stays free of `next/headers` so client components can import the
 * shape and the option lists; everything that touches the request lives in
 * ./settings-store and ./settings-actions.
 *
 * Note the scope mismatch a cookie has: device name, sampling rate and the
 * safety thresholds belong to the *instrument* and should be the same for every
 * operator, while the unit preference is genuinely per-person. Splitting them is
 * part of putting this on a real backend.
 */

export type CurrentUnit = "µA" | "nA";

export const SAMPLING_RATES = [
  { value: 10, label: "10 Hz (Low power)" },
  { value: 100, label: "100 Hz (Standard)" },
  { value: 1000, label: "1000 Hz (High resolution)" },
] as const;

export type DeviceSettings = {
  deviceName: string;
  autoReconnect: boolean;
  samplingRateHz: number;
  /** How current readings are displayed. See `forDisplay` in ./measurements. */
  currentUnit: CurrentUnit;
  /** Alert thresholds on input current, in µA. Null means not configured. */
  upperLimitUa: number | null;
  lowerLimitUa: number | null;
  simulationMode: boolean;
};

/** Matches the Figma frame's initial state. */
export const DEFAULT_SETTINGS: DeviceSettings = {
  deviceName: "ESM-Alpha-01",
  autoReconnect: true,
  samplingRateHz: 100,
  currentUnit: "µA",
  upperLimitUa: null,
  lowerLimitUa: null,
  simulationMode: false,
};

export const SETTINGS_COOKIE = "device-settings";

const MAX_NAME_LENGTH = 64;

function coerceName(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim().slice(0, MAX_NAME_LENGTH);
  return trimmed === "" ? fallback : trimmed;
}

function coerceBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function coerceLimit(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Every value that reaches storage goes through here. A Server Action is a
 * public POST endpoint, so the client's patch is untrusted input even though it
 * is typed on the way out.
 */
export function parseDeviceSettings(raw: unknown): DeviceSettings {
  const input = (typeof raw === "object" && raw !== null ? raw : {}) as Record<
    string,
    unknown
  >;

  const rate = Number(input.samplingRateHz);
  const unit = input.currentUnit;

  return {
    deviceName: coerceName(input.deviceName, DEFAULT_SETTINGS.deviceName),
    autoReconnect: coerceBoolean(
      input.autoReconnect,
      DEFAULT_SETTINGS.autoReconnect,
    ),
    samplingRateHz: SAMPLING_RATES.some((option) => option.value === rate)
      ? rate
      : DEFAULT_SETTINGS.samplingRateHz,
    currentUnit: unit === "nA" ? "nA" : "µA",
    upperLimitUa: coerceLimit(input.upperLimitUa),
    lowerLimitUa: coerceLimit(input.lowerLimitUa),
    simulationMode: coerceBoolean(
      input.simulationMode,
      DEFAULT_SETTINGS.simulationMode,
    ),
  };
}

/**
 * A lower limit above the upper limit would mark every reading on Live Test as
 * an alert, so it is rejected rather than quietly reordered — a safety
 * threshold that silently means something else is worse than an error message.
 */
export function validateThresholds(settings: DeviceSettings): string | null {
  const { upperLimitUa, lowerLimitUa } = settings;
  if (upperLimitUa === null || lowerLimitUa === null) return null;
  return lowerLimitUa > upperLimitUa
    ? "Lower limit must be below the upper limit."
    : null;
}

export function serialiseSettings(settings: DeviceSettings): string {
  return JSON.stringify(settings);
}
