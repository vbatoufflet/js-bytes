/** A Bytes object represent an amount of bytes. */
export declare class Bytes {
    /**
     * Create a new Bytes object from a bytes value.
     * @param value - bytes value
     */
    public static fromBytes(value: number): Bytes;

    /**
     * Create a new Bytes object from an input string.
     * @param text - text to parse
     * @param opts - parsing options
     */
    public static fromString(text: string, opts?: ParseOpts): Bytes;

    /**
     * Return whether or not the Bytes object is valid.
     */
    public isValid(): boolean;

    /**
     * Return whether or not the given object is a valid Bytes one.
     * @param obj - object to check
     */
    public static isBytes(obj: Record<string, unknown>): boolean;

    /**
     * Returns a string representation of the Bytes object using binary (i.e. IEC) units.
     * @param opts - formatting options
     */
    public toBinary(opts: FormatOpts<FormatBinaryUnit>): string;

    /**
     * Returns the current bytes value.
     */
    public toBytes(): number;

    /**
     * Returns a string representation of the Bytes object using decimal (i.e. SI) units.
     * @param opts - formatting options
     */
    public toDecimal(opts: FormatOpts<FormatDecimalUnit>): string;

    /**
     * Returns a string representation of the Bytes object according to provided formatting
     * options.
     * @param opts - formatting options
     */
    public toString(opts: FormatOpts): string;
}

/** Formatting options */
export declare interface FormatOpts<T = FormatUnit> {
    /**
     * Base to use for number formatting: `2` for binary mode (IEC) or `10` for decimal mode (SI).
     */
    base?: 2 | 10;

    /**
     * Decimal digits precision, with default to `2`.
     */
    digits?: number;

    /**
     * Format number according to a given locale. It uses the default locale if set to `true`, and
     * support is disabled when omitted.
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
     * Unit to format the bytes value to. It will automatically selects the one that best matches
     * the current bytes value when omitted.
     */
    unit?: T;
}

/** Formatting unit */
export declare type FormatUnit = FormatBinaryUnit | FormatDecimalUnit;

/** Formatting binary unit */
export declare type FormatBinaryUnit =
    | "byte"
    | "kibibyte"
    | "mebibyte"
    | "gibibyte"
    | "tebibyte"
    | "pebibyte";

/** Formatting decimal unit */
export declare type FormatDecimalUnit =
    | "byte"
    | "kilobyte"
    | "megabyte"
    | "gigabyte"
    | "terabyte"
    | "petabyte";

/** Parsing options */
export declare interface ParseOpts {
    /**
     * Parse number according to a given locale. It uses the default locale if set to `true`, and
     * support is disabled when omitted.
     */
    locale?: string | true;
}
