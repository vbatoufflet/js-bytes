/** A Bytes object represent an amount of bytes. */
export declare class Bytes {
    /**
     * Returns a copy of this Bytes object having the specified amount added to its value.
     * @param bytes - value to add
     */
    public add(bytes: number | string | Bytes): Bytes;

    /**
     * Converts the current bytes value to a given unit.
     * @param unit - byte unit
     */
    public as(unit: FormatUnit): number;

    /**
     * Create a new Bytes object from a numeric value.
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
     * Return whether or not the given object is a Bytes one.
     * @param obj - object to inspect
     */
    public static isBytes(obj: unknown): obj is Bytes;

    /**
     * Returns a copy of this Bytes object having the specified amount subtracted from its value.
     * @param bytes - value to subtract
     */
    public subtract(bytes: number | string | Bytes): Bytes;

    /**
     * Returns a string representation of the Bytes object using binary (i.e. IEC) units.
     * @param opts - formatting options
     */
    public toBinary(opts?: FormatOpts<FormatBinaryUnit>): string;

    /**
     * Returns a string representation of the Bytes object using decimal (i.e. SI) units.
     * @param opts - formatting options
     */
    public toDecimal(opts?: FormatOpts<FormatDecimalUnit>): string;

    /**
     * Returns a string representation of the Bytes object using a format specifier. Its verbs
     * syntax is greatly inspired by C's printf.
     *
     * Verbs:
     * ```
     * %b   bytes
     * %g   gigabytes
     * %G   gibibytes
     * %k   kilobytes
     * %K   kibibytes
     * %m   megabytes
     * %M   mebibytes
     * %p   petabytes
     * %P   pebibytes
     * %t   terabytes
     * %T   tebibytes
     * %v   decimal unit that best matches to the value (SI)
     * %V   binary unit that best matches to the value (IEC)
     * ```
     *
     * Width can be specified by a decimal number preceding the verb and the digits precision by
     * another decimal number directly following the width, separated by a period. Both are
     * optional and defaults will apply when omitted.
     *
     * Examples:
     * ```
     * %g      width: default   digits: default
     * %4g     width: 4         digits: default
     * %4.g    width: 4         digits: 0
     * %4.2g   width: 4         digits: 2
     * %.2g    width: default   digits: 2
     * ```
     *
     * Extra modifiers are supported to alter the output format, they must precede the width and
     * digits precision numbers.
     *
     * Modifiers:
     * ```
     * +   always print the numeric value sign
     * !   use short form (no space, no suffix)
     * ```
     *
     * @param format - format specifier
     * @param opts - formatting options
     */
    public toFormat(format: string, opts?: FormatOpts): string;

    /**
     * Returns a string representation of the Bytes object according to provided formatting
     * options.
     * @param opts - formatting options
     */
    public toString(opts?: FormatOpts): string;

    /**
     * Returns the current bytes value.
     */
    public valueOf(): number;
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

    /**
     * Minimum width for the formatted string, padding with spaces if necessary.
     */
    width?: number;
}

/** Formatting unit */
export declare type FormatUnit = FormatBinaryUnit | FormatDecimalUnit;

/** Formatting binary unit */
export declare type FormatBinaryUnit =
    | "bytes"
    | "kibibytes"
    | "mebibytes"
    | "gibibytes"
    | "tebibytes"
    | "pebibytes";

/** Formatting decimal unit */
export declare type FormatDecimalUnit =
    | "bytes"
    | "kilobytes"
    | "megabytes"
    | "gigabytes"
    | "terabytes"
    | "petabytes";

/** Parsing options */
export declare interface ParseOpts {
    /**
     * Parse number according to a given locale. It uses the default locale if set to `true`, and
     * support is disabled when omitted.
     */
    locale?: string | true;
}
