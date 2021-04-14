import {FormatOpts} from "../types";

interface Unit {
    text: string;
    value: number;
}

const binaryUnits: Unit[] = [
    {text: "Pi", value: Math.pow(1024, 5)},
    {text: "Ti", value: Math.pow(1024, 4)},
    {text: "Gi", value: Math.pow(1024, 3)},
    {text: "Mi", value: Math.pow(1024, 2)},
    {text: "Ki", value: 1024},
];

const decimalUnits: Unit[] = [
    {text: "P", value: 1e15},
    {text: "T", value: 1e12},
    {text: "G", value: 1e9},
    {text: "M", value: 1e6},
    {text: "k", value: 1e3},
];

const formatDefaults: FormatOpts = {
    base: 2,
    digits: 2,
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
        if (value / decimalUnits[idx].value >= 1) {
            return `${formatNumber(value / units[idx].value, opts)} ${units[idx].text}B`;
        }
    }

    return `${formatNumber(value, opts)} B`;
}

function formatNumber(value: number, opts: FormatOpts): string {
    const factor = opts.digits && opts.digits > 0 ? Math.pow(10, opts.digits) : 1;
    const v = Math.round(value * factor) / factor;

    return opts.locale
        ? v.toLocaleString(opts.locale !== true ? opts.locale : undefined)
        : v.toString();
}
