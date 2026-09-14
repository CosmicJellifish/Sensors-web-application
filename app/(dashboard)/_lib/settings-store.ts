import { cookies } from "next/headers";

import {
  type DeviceSettings,
  DEFAULT_SETTINGS,
  SETTINGS_COOKIE,
  parseDeviceSettings,
} from "./settings";

/**
 * Server-only access to the stored settings. Kept apart from ./settings so that
 * `next/headers` never reaches a client bundle — importing one constant from
 * the wrong side of that line fails the build.
 *
 * Reading a cookie opts every page that calls this into dynamic rendering,
 * which is correct: settings are per-request state.
 */
export async function getDeviceSettings(): Promise<DeviceSettings> {
  const stored = (await cookies()).get(SETTINGS_COOKIE)?.value;
  if (!stored) return DEFAULT_SETTINGS;
  try {
    return parseDeviceSettings(JSON.parse(stored));
  } catch {
    // A hand-edited or truncated cookie should degrade to the defaults rather
    // than take the whole dashboard down.
    return DEFAULT_SETTINGS;
  }
}
