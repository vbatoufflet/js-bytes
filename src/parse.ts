import {ParseOpts} from "@/types";

import {isDigit, isSpace} from "./string";
import {binaryUnits, byteSuffix, decimalUnits} from "./unit";

const unitPrefixes = decimalUnits
    .map(a => a.prefix)
    .join("")
    .toUpperCase();

export class Parser {
    private decimal = ".";

    private group = "";

    private minusSign = "-";

    private numerals: Map<string, string> | null = null;

    private text: string;

    public constructor(text: string, opts?: ParseOpts) {
        this.text = text;

        if (opts?.locale) {
            // As the ECMAScript Internationalization API only provides number formatting,
            // implement parsing based on Mike Bostock's solution to determine the number symbols
            // associated with the requested locale.
            //
            // See: https://observablehq.com/@mbostock/localized-number-parsing
            const locale = opts.locale !== true ? opts.locale : undefined;
            const parts = Intl.NumberFormat(locale).formatToParts(-1234.5);

            this.decimal = parts.find(a => a.type === "decimal")?.value ?? ".";
            this.group = parts.find(a => a.type === "group")?.value ?? "";
            this.minusSign = parts.find(a => a.type === "minusSign")?.value ?? "-";

            this.numerals = new Map(
                [...new Intl.NumberFormat(locale, {useGrouping: false}).format(9876543210)]
                    .reverse()
                    .map((value, index) => [value, index.toString()]),
            );
        }
    }

    public parseString(): number {
        const value = this.scanNumber();
        if (isNaN(value)) {
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

        if (this.text.length > 1 || (this.text.length === 1 && this.read() !== byteSuffix)) {
            return NaN;
        }

        return value * (binary ? binaryUnits : decimalUnits)[idx].value;
    }

    private peek(): string {
        return this.text.charAt(0);
    }

    private read(): string {
        const c = this.text.charAt(0);
        this.text = this.text.slice(1);
        return c;
    }

    private scanNumber(): number {
        let c: string;
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
            } else if (c === this.decimal) {
                if (s.includes(".")) {
                    this.unread(c);
                    break;
                }

                s += ".";
            } else if (c === this.group || (isSpace(c) && isSpace(this.group))) {
                continue;
            } else {
                this.unread(c);
                break;
            }
        }

        return Number.parseFloat(s);
    }

    private unread(c: string): void {
        this.text = c + this.text;
    }
}

export function parseString(text: string, opts?: ParseOpts): number {
    return new Parser(text, opts).parseString();
}
