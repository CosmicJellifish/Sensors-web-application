/**
 * What the rig measures, declared once for the whole dashboard.
 *
 * Every label, table heading and unit on Live Test and Data Export is derived
 * from this list. Before it existed the unit was a literal in three unrelated
 * places, which is how the two pages came to disagree about what the output
 * column is — a disagreement this file can no longer express.
 */

export type MeasurementId =
  | "input-current"
  | "output-current"
  | "temperature"
  | "humidity";

export type Measurement = {
  id: MeasurementId;
  /** Long form, used by the Export Parameters checkboxes. */
  name: string;
  /** Short form, used as a table column heading. */
  shortName: string;
  /**
   * The canonical unit a value is stored in, and the only place it is written
   * down. Both currents are µA.
   *
   * The Figma frames disagreed about the output column — Data Export labelled
   * it mA in its table and on its checkbox, Live Test labelled it µA — and Live
   * Test was right. Data Export's frame is wrong wherever it says mA; its mock
   * values are simply a run an order of magnitude smaller than Live Test's, not
   * the same numbers in a different unit.
   */
  unit: string;
  /** Decimals to render. Stored values stay full-precision numbers. */
  precision: number;
  /** True for environmental values the rig models rather than measures. */
  simulated: boolean;
};

/** Column order in tables and exports follows this list, not the order the
 *  operator ticked the boxes, so columns stay put. */
export const MEASUREMENTS: readonly Measurement[] = [
  {
    id: "input-current",
    name: "Input Current",
    shortName: "Input",
    unit: "µA",
    precision: 1,
    simulated: false,
  },
  {
    id: "output-current",
    name: "Output Current",
    shortName: "Output",
    unit: "µA",
    // The rig resolves current to 0.1 µA, so both currents render at 1dp.
    // Data Export's frame shows 2dp here; that was fabricated precision, the
    // same way its unit was wrong.
    precision: 1,
    simulated: false,
  },
  {
    id: "temperature",
    name: "Temperature",
    shortName: "Temp",
    unit: "°C",
    precision: 1,
    simulated: true,
  },
  {
    id: "humidity",
    name: "Humidity",
    shortName: "Humidity",
    unit: "%",
    precision: 1,
    simulated: true,
  },
];

export function measurement(id: MeasurementId): Measurement {
  const found = MEASUREMENTS.find((m) => m.id === id);
  if (!found) throw new Error(`Unknown measurement: ${id}`);
  return found;
}

/**
 * A measurement as the operator has asked to see it. `scale` converts a stored
 * value into the display unit; it is 1 whenever no conversion applies.
 */
export type DisplayMeasurement = Measurement & { scale: number };

/**
 * Applies the µA/nA preference from Device Settings.
 *
 * Only measurements whose canonical unit is µA are converted — which is both
 * currents, and nothing else. That is not a special case: a µA/nA toggle
 * applies to readings stored in µA. Temperature and humidity are untouched
 * because their units have nothing to do with it.
 */
export function forDisplay(
  target: Measurement,
  currentUnit: "µA" | "nA",
): DisplayMeasurement {
  if (target.unit === "µA" && currentUnit === "nA") {
    return {
      ...target,
      unit: "nA",
      // 12.1 µA is 12100 nA: three orders of magnitude of the decimals are no
      // longer decimals.
      precision: Math.max(0, target.precision - 3),
      scale: 1000,
    };
  }
  return { ...target, scale: 1 };
}

/** Converts a stored value into its display unit without rounding it. */
export function toDisplayValue(
  value: number,
  target: { scale?: number },
): number {
  return value * (target.scale ?? 1);
}

/** Renders a stored value the way the operator expects to read it. */
export function formatReading(
  value: number | undefined,
  target: { precision: number; scale?: number },
): string {
  return value === undefined
    ? "—"
    : toDisplayValue(value, target).toFixed(target.precision);
}
