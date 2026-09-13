"use client";

import { useState, useTransition } from "react";

import type { DeviceSettings } from "../../_lib/settings";
import { updateDeviceSettings } from "../../_lib/settings-actions";

type Status =
  | { kind: "idle" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

/**
 * Shared save path for every card on the page. The Figma frame has no Save
 * button, so each control commits on its own — toggles and selects the moment
 * they change, text and number fields when they lose focus, which keeps a
 * half-typed threshold from ever being written.
 */
export function useSettingSave() {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function save(
    patch: Partial<DeviceSettings>,
    onSaved?: (settings: DeviceSettings) => void,
  ) {
    startTransition(async () => {
      const result = await updateDeviceSettings(patch);
      if (result.ok) {
        setStatus({ kind: "saved" });
        // The server normalises values (trimming a name, rejecting a limit), so
        // the caller reseeds its draft from what was actually stored.
        onSaved?.(result.settings);
      } else {
        setStatus({ kind: "error", message: result.message });
      }
    });
  }

  return { save, pending, status };
}

/**
 * Sits in the empty right-hand half of a card header. Positioned absolutely so
 * appearing and disappearing never shifts the fields below it.
 */
export function SaveStatus({
  pending,
  status,
}: {
  pending: boolean;
  status: Status;
}) {
  const label = pending
    ? "Saving…"
    : status.kind === "saved"
      ? "Saved"
      : status.kind === "error"
        ? "Not saved"
        : "";

  return (
    <span
      aria-live="polite"
      className={`absolute top-[22px] right-[24px] text-[12px] leading-[16px] font-medium ${
        status.kind === "error" && !pending ? "text-danger" : "text-ink-subtle"
      }`}
    >
      {label}
    </span>
  );
}

export function SaveError({ status }: { status: Status }) {
  if (status.kind !== "error") return null;
  return (
    <p role="alert" className="text-[12px] leading-[16px] text-danger">
      {status.message}
    </p>
  );
}
