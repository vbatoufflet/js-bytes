import { binaryUnits, byteSuffix, decimalUnits, type FormatUnit } from "./unit.js";

/** Formatting options */
export interface FormatOpts<T = FormatUnit> {
  /**
   * Base to use for number formatting: `2` for binary mode (IEC) or `10` for decimal mode (SI).
   */
  base?: 2 | 10;

  /**
   * Decimal digits precision, with default to `2`.
   */
  digits?: number;

  /**
   * Format number according to a given locale. It uses the default locale if set to `true`, and support is
   * disabled when omitted.
   */
  locale?: string | true;

  /**
   * Always print the sign associated with the numeric bytes value.
   */
  sign?: boolean;

  /**
   * Add a space between the value and its unit, with default to `true`.
   */
  space?: boolean;

  /**
   * Append the bytes suffix to the formatted string, with default to `true`.
   */
  suffix?: boolean;

  /**
   * Unit to format the bytes value to. It will automatically selects the one that best matches the current
   * bytes value when omitted.
   */
  unit?: T;

  /**
   * Minimum width for the formatted string, padding with spaces if necessary.
   */
  width?: number;
}

export interface FormatSpec {
  text: string;
  formats: {
    index: number;
    opts: FormatOpts;
  }[];
}

const formatDefaults: FormatOpts = {
  base: 2,
  digits: 2,
  space: true,
  suffix: true,
};

export function format(value: number, opts: FormatOpts): string {
  if (Number.isNaN(value)) {
    return "Invalid Bytes";
  }

  opts = { ...formatDefaults, ...opts };

  const units = opts.base === 2 ? binaryUnits : decimalUnits;

  // Always use decimal units to choose the one that will format the value, thus preferring "0.98 KiB" over
  // "1000 B".
  if (opts.unit !== "bytes") {
    const idx = opts.unit
      ? units.findIndex(a => a.format === opts.unit)
      : decimalUnits.findIndex(a => Math.abs(value / a.value) >= 1);

    if (idx !== -1) {
      return formatValue(value / units[idx].value, units[idx].prefix, opts);
    }
  }

  return formatValue(Math.round(value), null, opts);
}

export function formatAs(value: number, unit: FormatUnit): number {
  if (Number.isNaN(value)) {
    return NaN;
  }

  if (unit === "bytes") {
    return Math.round(value);
  }

  const entry = [...binaryUnits, ...decimalUnits].find(a => a.format === unit);
  return entry ? value / entry.value : NaN;
}

function formatValue(value: number, unit: null | string, opts: FormatOpts): string {
  const factor = opts.digits && opts.digits > 0 ? 10 ** opts.digits : 1;
  const v = Math.round(value * factor) / factor;

  let s = opts.locale ? v.toLocaleString(opts.locale !== true ? opts.locale : undefined) : v.toString();

  if (opts.sign && v > 0) {
    s = `+${s}`;
  }

  if (opts.space && (unit !== null || opts.suffix)) {
    s += "\xa0";
  }

  if (unit !== null) {
    s += unit;
  }

  if (opts.suffix) {
    s += byteSuffix;
  }

  return opts.width ? s.padStart(opts.width) : s;
}
