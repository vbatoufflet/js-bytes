import {FormatBinaryUnit, FormatDecimalUnit, FormatOpts, ParseOpts} from "@/types";

import {format} from "./format";
import {parseFormat, parseString} from "./parse";

export class Bytes {
    protected bytesObject: boolean;

    private value: number;

    private constructor(value: number) {
        this.value = value;
        this.bytesObject = true;
    }

    public add(bytes: number | string | Bytes): Bytes {
        return this.adaptValue(bytes, false);
    }

    public static fromBytes(value: number): Bytes {
        return new Bytes(value);
    }

    public static fromString(text: string, opts?: ParseOpts): Bytes {
        return new Bytes(parseString(text, opts));
    }

    public isValid(): boolean {
        return !isNaN(this.value);
    }

    public static isBytes(obj: unknown): obj is Bytes {
        return Boolean((obj as Bytes).bytesObject);
    }

    public subtract(bytes: number | string | Bytes): Bytes {
        return this.adaptValue(bytes, true);
    }

    public toBinary(opts?: FormatOpts<FormatBinaryUnit>): string {
        return format(this.value, {...opts, base: 2});
    }

    public toDecimal(opts?: FormatOpts<FormatDecimalUnit>): string {
        return format(this.value, {...opts, base: 10});
    }

    public toFormat(format: string, opts?: FormatOpts): string {
        const spec = parseFormat(format);

        let out = spec.text;
        spec.formats.reverse().forEach(fmt => {
            out =
                out.slice(0, fmt.index) +
                this.toString({...fmt.opts, ...opts}) +
                out.slice(fmt.index);
        });

        return out;
    }

    public toString(opts?: FormatOpts): string {
        return format(this.value, opts ?? {});
    }

    public valueOf(): number {
        return Math.round(this.value);
    }

    private adaptValue(bytes: number | string | Bytes, negate: boolean): Bytes {
        let v: number;
        if (typeof bytes === "number") {
            v = bytes;
        } else if (typeof bytes === "string") {
            v = parseString(bytes);
        } else if (Bytes.isBytes(bytes)) {
            v = bytes.value;
        } else {
            return new Bytes(NaN);
        }

        return new Bytes(negate ? this.value - v : this.value + v);
    }
}
