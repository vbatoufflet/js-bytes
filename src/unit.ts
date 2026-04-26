/** Formatting binary unit */
// eslint-disable-next-line perfectionist/sort-union-types -- Units are ordered by byte scale.
export type FormatBinaryUnit = "bytes" | "kibibytes" | "mebibytes" | "gibibytes" | "tebibytes" | "pebibytes";

/** Formatting decimal unit */
// eslint-disable-next-line perfectionist/sort-union-types -- Units are ordered by byte scale.
export type FormatDecimalUnit = "bytes" | "kilobytes" | "megabytes" | "gigabytes" | "terabytes" | "petabytes";

/** Formatting unit */
export type FormatUnit = FormatBinaryUnit | FormatDecimalUnit;

interface Unit {
  format: FormatUnit;
  prefix: string;
  value: number;
}

export const binaryUnits: Unit[] = [
  { format: "pebibytes", prefix: "Pi", value: 1024 ** 5 },
  { format: "tebibytes", prefix: "Ti", value: 1024 ** 4 },
  { format: "gibibytes", prefix: "Gi", value: 1024 ** 3 },
  { format: "mebibytes", prefix: "Mi", value: 1024 ** 2 },
  { format: "kibibytes", prefix: "Ki", value: 1024 },
];

export const decimalUnits: Unit[] = [
  { format: "petabytes", prefix: "P", value: 1e15 },
  { format: "terabytes", prefix: "T", value: 1e12 },
  { format: "gigabytes", prefix: "G", value: 1e9 },
  { format: "megabytes", prefix: "M", value: 1e6 },
  { format: "kilobytes", prefix: "k", value: 1e3 },
];

export const byteSuffix = "B";
