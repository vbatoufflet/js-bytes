import {FormatUnit} from "@/types";

interface Unit {
    format: FormatUnit;
    prefix: string;
    value: number;
}

export const binaryUnits: Unit[] = [
    {format: "pebibyte", prefix: "Pi", value: Math.pow(1024, 5)},
    {format: "tebibyte", prefix: "Ti", value: Math.pow(1024, 4)},
    {format: "gibibyte", prefix: "Gi", value: Math.pow(1024, 3)},
    {format: "mebibyte", prefix: "Mi", value: Math.pow(1024, 2)},
    {format: "kibibyte", prefix: "Ki", value: 1024},
];

export const decimalUnits: Unit[] = [
    {format: "petabyte", prefix: "P", value: 1e15},
    {format: "terabyte", prefix: "T", value: 1e12},
    {format: "gigabyte", prefix: "G", value: 1e9},
    {format: "megabyte", prefix: "M", value: 1e6},
    {format: "kilobyte", prefix: "k", value: 1e3},
];

export const byteSuffix = "B";
