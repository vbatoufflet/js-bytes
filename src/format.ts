import {FormatOpts} from "@/types";

import {binaryUnits, byteSuffix, decimalUnits} from "./unit";

const formatDefaults: FormatOpts = {
    base: 2,
    digits: 2,
    space: true,
    suffix: true,
};

export function format(value: number, opts: FormatOpts): string {
    if (isNaN(value)) {
        return "Invalid Bytes";
    }

    opts = Object.assign({}, formatDefaults, opts);

    const units = opts.base === 2 ? binaryUnits : decimalUnits;

    // Always use decimal units to choose the one that will format the value, thus preferring
    // "0.98 KiB" over "1000 B".
    if (opts.unit !== "byte") {
        const idx = opts.unit
            ? units.findIndex(a => a.format === opts.unit)
            : decimalUnits.findIndex(a => Math.abs(value / a.value) >= 1);

        if (idx !== -1) {
            return formatValue(value / units[idx].value, units[idx].prefix, opts);
        }
    }

    return formatValue(Math.round(value), null, opts);
}

function formatValue(value: number, unit: string | null, opts: FormatOpts): string {
    const factor = opts.digits && opts.digits > 0 ? Math.pow(10, opts.digits) : 1;
    const v = Math.round(value * factor) / factor;

    let s = opts.locale
        ? v.toLocaleString(opts.locale !== true ? opts.locale : undefined)
        : v.toString();

    if (opts.sign && v > 0) {
        s = `+${s}`;
    }

    if (opts.space && (unit !== null || opts.suffix)) {
        s += "\xa0";
    }

    if (unit !== null) {
        s += unit;
    }

    if (opts.suffix) {
        s += byteSuffix;
    }

    return opts.width ? s.padStart(opts.width) : s;
}
