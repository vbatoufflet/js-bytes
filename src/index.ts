import {FormatOpts, ParseOpts} from "../types";
import {format} from "./format";
import {parse} from "./parse";

type AnyObject = Record<string, unknown>;

/**
 * A Bytes object represents an amount of bytes.
 */
export class Bytes {
    protected bytesObject: boolean;

    private value: number | null;

    private constructor(value: number) {
        this.value = !isNaN(value) && value >= 0 ? value : null;
        this.bytesObject = true;
    }

    /**
     * Create a new Bytes object from a bytes value.
     * @param value - bytes value
     */
    public static fromBytes(value: number): Bytes {
        return new Bytes(value);
    }

    /**
     * Create a new Bytes object from an input string.
     * @param text - text to parse
     * @param opts - parsing options
     */
    public static fromString(text: string, opts?: ParseOpts): Bytes {
        return new Bytes(parse(text, opts) as number);
    }

    /**
     * Return whether or not the Bytes object is valid.
     */
    public isValid(): boolean {
        return this.value !== null;
    }

    /**
     * Return whether or not the given object is a valid Bytes one.
     * @param obj - object to check
     */
    public static isBytes(obj: AnyObject): boolean {
        return Boolean(obj.bytesObject);
    }

    /**
     * Returns a string representation of the Bytes object using binary (i.e. IEC) units.
     * @param opts - formatting options
     */
    public toBinary(opts: FormatOpts): string {
        return format(this.value, {...opts, base: 2});
    }

    /**
     * Returns the current bytes value.
     */
    public toBytes(): number {
        return this.value !== null ? Math.round(this.value) : NaN;
    }

    /**
     * Returns a string representation of the Bytes object using decimal (i.e. SI) units.
     * @param opts - formatting options
     */
    public toDecimal(opts: FormatOpts): string {
        return format(this.value, {...opts, base: 10});
    }

    /**
     * Returns a string representation of the Bytes object according to provided formatting options.
     * @param opts - formatting options
     */
    public toString(opts: FormatOpts): string {
        return format(this.value, opts);
    }
}
