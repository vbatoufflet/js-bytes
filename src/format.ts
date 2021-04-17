import {FormatOpts} from "@/types";

import {BinaryPrefix, byteSuffix, DecimalPrefix} from "./unit";

interface Unit<T = BinaryPrefix | DecimalPrefix> {
    prefix: T;
    value: number;
}

export const binaryUnits: Unit<BinaryPrefix>[] = [
    {prefix: BinaryPrefix.PEBI, value: Math.pow(1024, 5)},
    {prefix: BinaryPrefix.TEBI, value: Math.pow(1024, 4)},
    {prefix: BinaryPrefix.GIBI, value: Math.pow(1024, 3)},
    {prefix: BinaryPrefix.MEBI, value: Math.pow(1024, 2)},
    {prefix: BinaryPrefix.KIBI, value: 1024},
];

export const decimalUnits: Unit<DecimalPrefix>[] = [
    {prefix: DecimalPrefix.PETA, value: 1e15},
    {prefix: DecimalPrefix.TERA, value: 1e12},
    {prefix: DecimalPrefix.GIGA, value: 1e9},
    {prefix: DecimalPrefix.MEGA, value: 1e6},
    {prefix: DecimalPrefix.KILO, value: 1e3},
];

const formatDefaults: FormatOpts = {
    base: 2,
    digits: 2,
    space: true,
    suffix: true,
};

export function format(value: number | null, opts: FormatOpts): string {
    if (value === null) {
        return "Invalid Bytes";
    } else if (value === 0) {
        return "0";
    }

    opts = Object.assign({}, formatDefaults, opts);

    const units = opts.base === 2 ? binaryUnits : decimalUnits;

    for (const idx in units) {
        // Always use decimal units to choose the one that will format the value, thus preferring
        // "0.98 KiB" over "1000 B".
        if (Math.abs(value / decimalUnits[idx].value) >= 1) {
            return formatValue(value / units[idx].value, units[idx].prefix, opts);
        }
    }

    return formatValue(value, null, opts);
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

    return s;
}
