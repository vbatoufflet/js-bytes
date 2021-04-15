import {FormatOpts} from "../types";
import {BinaryUnit, DecimalUnit} from "./unit";

interface UnitRef<T = BinaryUnit | DecimalUnit> {
    text: T;
    value: number;
}

export const binaryUnits: UnitRef<BinaryUnit>[] = [
    {text: BinaryUnit.PEBI, value: Math.pow(1024, 5)},
    {text: BinaryUnit.TEBI, value: Math.pow(1024, 4)},
    {text: BinaryUnit.GIBI, value: Math.pow(1024, 3)},
    {text: BinaryUnit.MEBI, value: Math.pow(1024, 2)},
    {text: BinaryUnit.KIBI, value: 1024},
];

export const decimalUnits: UnitRef<DecimalUnit>[] = [
    {text: DecimalUnit.PETA, value: 1e15},
    {text: DecimalUnit.TERA, value: 1e12},
    {text: DecimalUnit.GIGA, value: 1e9},
    {text: DecimalUnit.MEGA, value: 1e6},
    {text: DecimalUnit.KILO, value: 1e3},
];

const formatDefaults: FormatOpts = {
    base: 2,
    digits: 2,
    space: true,
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
            return formatValue(value / units[idx].value, units[idx].text, opts);
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

    if (opts.space) {
        s += "\xa0";
    }
    if (unit !== null) {
        s += unit;
    }

    return `${s}B`;
}
