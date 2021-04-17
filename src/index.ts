import {FormatBinaryUnit, FormatDecimalUnit, FormatOpts, ParseOpts} from "@/types";

import {format} from "./format";
import {parseString} from "./parse";

export class Bytes {
    protected bytesObject: boolean;

    private value: number;

    private constructor(value: number) {
        this.value = value;
        this.bytesObject = true;
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

    public static isBytes(obj: Record<string, unknown>): boolean {
        return Boolean(obj.bytesObject);
    }

    public toBinary(opts: FormatOpts<FormatBinaryUnit>): string {
        return format(this.value, {...opts, base: 2});
    }

    public toBytes(): number {
        return this.value !== null ? Math.round(this.value) : NaN;
    }

    public toDecimal(opts: FormatOpts<FormatDecimalUnit>): string {
        return format(this.value, {...opts, base: 10});
    }

    public toString(opts: FormatOpts): string {
        return format(this.value, opts);
    }
}
