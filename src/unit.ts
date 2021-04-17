import {FormatUnit} from "@/types";

interface Unit {
    format: FormatUnit;
    prefix: string;
    value: number;
}

export const binaryUnits: Unit[] = [
    {format: "pebibytes", prefix: "Pi", value: Math.pow(1024, 5)},
    {format: "tebibytes", prefix: "Ti", value: Math.pow(1024, 4)},
    {format: "gibibytes", prefix: "Gi", value: Math.pow(1024, 3)},
    {format: "mebibytes", prefix: "Mi", value: Math.pow(1024, 2)},
    {format: "kibibytes", prefix: "Ki", value: 1024},
];

export const decimalUnits: Unit[] = [
    {format: "petabytes", prefix: "P", value: 1e15},
    {format: "terabytes", prefix: "T", value: 1e12},
    {format: "gigabytes", prefix: "G", value: 1e9},
    {format: "megabytes", prefix: "M", value: 1e6},
    {format: "kilobytes", prefix: "k", value: 1e3},
];

export const byteSuffix = "B";
