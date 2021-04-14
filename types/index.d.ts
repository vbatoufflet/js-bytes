/** Formatting options */
export declare interface FormatOpts {
    /**
     * Base to use for number formatting: `2` for binary mode (IEC) or `10`
     * for decimal mode (SI).
     */
    base?: 2 | 10;

    /**
     * Decimal digits precision, with default to `2`.
     */
    digits?: number;

    /**
     * Format number according to a given locale. It uses the default locale
     * if set to `true`, and support is disabled when omitted.
     */
    locale?: string | true;
}

/** Parsing options */
export declare interface ParseOpts {
    /**
     * Parse number according to a given locale. It uses the default locale
     * if set to `true`, and support is disabled when omitted.
     */
    locale?: string | true;
}
