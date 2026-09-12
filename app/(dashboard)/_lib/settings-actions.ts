"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import {
  type DeviceSettings,
  SETTINGS_COOKIE,
  parseDeviceSettings,
  serialiseSettings,
  validateThresholds,
} from "./settings";
import { getDeviceSettings } from "./settings-store";

export type SaveResult =
  | { ok: true; settings: DeviceSettings }
  | { ok: false; message: string };

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * The page's only write path. Takes a patch rather than the whole record so two
 * controls saved in quick succession cannot clobber each other's field.
 *
 * A Server Action is reachable by direct POST, so `patch` is untrusted: it is
 * merged onto the stored settings and the result re-validated in full before
 * anything is written. There is no auth check here because the app has no
 * sessions yet — that has to be added here before this ships.
 */
export async function updateDeviceSettings(
  patch: Partial<DeviceSettings>,
): Promise<SaveResult> {
  const current = await getDeviceSettings();
  const next = parseDeviceSettings({ ...current, ...patch });

  const problem = validateThresholds(next);
  if (problem) return { ok: false, message: problem };

  (await cookies()).set(SETTINGS_COOKIE, serialiseSettings(next), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: ONE_YEAR_SECONDS,
  });

  // Live Test reads the thresholds and the unit preference, so it has to be
  // rebuilt too, not just the page that did the writing.
  revalidatePath("/device-settings");
  revalidatePath("/live-test");
  revalidatePath("/data-export");

  return { ok: true, settings: next };
}
