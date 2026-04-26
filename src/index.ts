import { format, formatAs, type FormatOpts } from "./format.js";
import { parseFormat, type ParseOpts, parseString } from "./parse.js";
import { type FormatBinaryUnit, type FormatDecimalUnit, type FormatUnit } from "./unit.js";

export class Bytes {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  public static fromBytes(value: number): Bytes {
    return new Bytes(value);
  }

  public static fromString(text: string, opts?: ParseOpts): Bytes {
    return new Bytes(parseString(text, opts));
  }

  public add(bytes: Bytes | number | string): Bytes {
    return this.adaptValue(bytes, false);
  }

  public as(unit: FormatUnit): number {
    return formatAs(this.value, unit);
  }

  public isValid(): boolean {
    return !Number.isNaN(this.value);
  }

  public subtract(bytes: Bytes | number | string): Bytes {
    return this.adaptValue(bytes, true);
  }

  public toBinary(opts?: FormatOpts<FormatBinaryUnit>): string {
    return format(this.value, { ...opts, base: 2 });
  }

  public toDecimal(opts?: FormatOpts<FormatDecimalUnit>): string {
    return format(this.value, { ...opts, base: 10 });
  }

  public toFormat(format: string, opts?: FormatOpts): string {
    const spec = parseFormat(format);

    let out = spec.text;
    spec.formats.reverse().forEach((fmt) => {
      out = out.slice(0, fmt.index) + this.toString({ ...fmt.opts, ...opts }) + out.slice(fmt.index);
    });

    return out;
  }

  public toString(opts?: FormatOpts): string {
    return format(this.value, opts ?? {});
  }

  public valueOf(): number {
    return Math.round(this.value);
  }

  private adaptValue(bytes: Bytes | number | string, negate: boolean): Bytes {
    const value = typeof bytes === "number"
      ? bytes
      : typeof bytes === "string"
        ? parseString(bytes)
        : bytes instanceof Bytes
          ? bytes.value
          : NaN;

    return new Bytes(negate ? this.value - value : this.value + value);
  }
}

export type { FormatOpts } from "./format.js";
export type { ParseOpts } from "./parse.js";
export type { FormatBinaryUnit, FormatDecimalUnit, FormatUnit } from "./unit.js";
