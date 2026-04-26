import { type FormatOpts, type FormatSpec } from "./format.js";
import { isDigit, isSpace } from "./string.js";
import { binaryUnits, byteSuffix, decimalUnits, unitPrefixes } from "./unit.js";

/** Parsing options */
export interface ParseOpts {
  /**
   * Parse number according to a given locale. It uses the default locale if set to `true`, and support is
   * disabled when omitted.
   */
  locale?: string | true;
}

export class Parser {
  private decimal = ".";

  private group = "";

  private minusSign = "-";

  private numerals: Map<string, string> | null = null;

  private pos = 0;

  private text: string;

  public constructor(text: string, opts?: ParseOpts) {
    this.text = text;

    if (opts?.locale) {
      // As the ECMAScript Internationalization API only provides number formatting, implement parsing based
      // on Mike Bostock's solution to determine the number symbols associated with the requested locale.
      //
      // See: https://observablehq.com/@mbostock/localized-number-parsing
      const locale = opts.locale !== true ? opts.locale : undefined;
      const parts = Intl.NumberFormat(locale).formatToParts(-1234.5); // eslint-disable-line new-cap

      this.decimal = parts.find(a => a.type === "decimal")?.value ?? ".";
      this.group = parts.find(a => a.type === "group")?.value ?? "";
      this.minusSign = parts.find(a => a.type === "minusSign")?.value ?? "-";

      this.numerals = new Map();

      let index = 0;
      for (const digit of new Intl.NumberFormat(locale, { useGrouping: false }).format(9876543210)) {
        this.numerals.set(digit, (9 - index).toString());
        index++;
      }
    }
  }

  public parseFormat(): FormatSpec {
    const str: FormatSpec = {
      text: "",
      formats: [],
    };

    let c: string;

    for (;;) {
      c = this.read();

      if (c === "") {
        break;
      } else if (c === "%" && this.peek() !== "%") {
        str.formats.push({ index: str.text.length, opts: this.scanVerb() });
      } else {
        if (c === "%") {
          this.read();
        }
        str.text += c;
      }
    }

    return str;
  }

  public parseString(): number {
    const value = this.scanNumber();
    if (Number.isNaN(value)) {
      return NaN;
    }

    if (isSpace(this.peek())) {
      this.read();
    }

    const c = this.read();
    if (c === "" || c === byteSuffix) {
      return value;
    }

    const idx = c === "k" ? unitPrefixes.length - 1 : unitPrefixes.indexOf(c);
    if (idx === -1) {
      return NaN;
    }

    const binary = this.peek() === "i";
    if (binary) {
      this.read();
    }

    const rest = this.text.length - this.pos;
    if (rest > 1 || (rest === 1 && this.read() !== byteSuffix)) {
      return NaN;
    }

    return value * (binary ? binaryUnits : decimalUnits)[idx].value;
  }

  private peek(): string {
    return this.text.charAt(this.pos);
  }

  private read(): string {
    return this.text.charAt(this.pos++);
  }

  private scanNumber(decimal = true): number {
    let c: string;
    let hasDecimal = false;
    let s = "";

    for (;;) {
      c = this.read();

      if (c === "") {
        break;
      } else if (c === this.minusSign && s.length === 0) {
        s += "-";
      } else if (this.numerals?.has(c)) {
        s += this.numerals.get(c);
      } else if (this.numerals === null && isDigit(c)) {
        s += c;
      } else if (decimal && c === this.decimal) {
        if (hasDecimal) {
          this.unread();
          break;
        }

        hasDecimal = true;
        s += ".";
      } else if (c === this.group || (isSpace(c) && isSpace(this.group))) {
        continue;
      } else {
        this.unread();
        break;
      }
    }

    return Number.parseFloat(s);
  }

  private scanVerb(): FormatOpts {
    const start = this.pos;
    const opts: FormatOpts = {};

    let c = this.read();

    while (c === "+" || c === "!") {
      switch (c) {
        case "!":
          opts.space = false;
          opts.suffix = false;
          break;
        case "+":
          opts.sign = true;
          break;
      }

      c = this.read();
    }

    if (isDigit(c)) {
      this.unread();
      opts.width = this.scanNumber(false);
      c = this.read();
    }

    if (c === ".") {
      opts.digits = isDigit(this.peek()) ? this.scanNumber(false) : 0;
      c = this.read();
    }

    if (c === "" || isSpace(c)) {
      throw new SyntaxError(`missing format verb: %${this.text.slice(start, this.pos - 1)}`);
    }

    if (c === "b") {
      opts.unit = "bytes";
      return opts;
    }

    if (c === "v" || c === "V") {
      opts.base = c === "V" ? 2 : 10;
    } else {
      const idx = unitPrefixes.indexOf(c.toUpperCase());
      if (idx === -1) {
        throw new SyntaxError(`unknown format verb: %${c}`);
      }

      const binary = c === c.toUpperCase();

      opts.base = binary ? 2 : 10;
      opts.unit = binary ? binaryUnits[idx].format : decimalUnits[idx].format;
    }

    return opts;
  }

  private unread(): void {
    this.pos--;
  }
}

export function parseFormat(format: string): FormatSpec {
  return new Parser(format).parseFormat();
}

export function parseString(text: string, opts?: ParseOpts): number {
  return new Parser(text, opts).parseString();
}
