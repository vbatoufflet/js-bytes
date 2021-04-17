import {FormatOpts, ParseOpts} from "@/types";

import {format} from "./format";
import {parse} from "./parse";

export class Bytes {
    protected bytesObject: boolean;

    private value: number | null;

    private constructor(value: number) {
        this.value = !isNaN(value) ? value : null;
        this.bytesObject = true;
    }

    public static fromBytes(value: number): Bytes {
        return new Bytes(value);
    }

    public static fromString(text: string, opts?: ParseOpts): Bytes {
        return new Bytes(parse(text, opts) as number);
    }

    public isValid(): boolean {
        return this.value !== null;
    }

    public static isBytes(obj: Record<string, unknown>): boolean {
        return Boolean(obj.bytesObject);
    }

    public toBinary(opts: FormatOpts): string {
        return format(this.value, {...opts, base: 2});
    }

    public toBytes(): number {
        return this.value !== null ? Math.round(this.value) : NaN;
    }

    public toDecimal(opts: FormatOpts): string {
        return format(this.value, {...opts, base: 10});
    }

    public toString(opts: FormatOpts): string {
        return format(this.value, opts);
    }
}
