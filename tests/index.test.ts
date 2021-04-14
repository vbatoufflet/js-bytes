import {assert} from "chai";
import {it} from "mocha";

import {Bytes} from "../src";

const testData: {
    input: string;
    expected: {
        binary: string[];
        bytes: number;
        decimal: string[];
        valid: boolean;
    };
    locale?: string;
}[] = [
    {
        input: "0 B",
        expected: {
            binary: ["0", "0", "0"],
            bytes: 0,
            decimal: ["0", "0", "0"],
            valid: true,
        },
    },
    {
        input: "0 KiB",
        expected: {
            binary: ["0", "0", "0"],
            bytes: 0,
            decimal: ["0", "0", "0"],
            valid: true,
        },
    },
    {
        input: "0.001 kB",
        expected: {
            binary: ["1 B", "1 B", "1 B"],
            bytes: 1,
            decimal: ["1 B", "1 B", "1 B"],
            valid: true,
        },
    },
    {
        input: "0.1 KiB",
        expected: {
            binary: ["102 B", "102.4 B", "102.4 B"],
            bytes: 102,
            decimal: ["102 B", "102.4 B", "102.4 B"],
            valid: true,
        },
    },
    {
        input: "0.1 B",
        expected: {
            binary: ["0 B", "0.1 B", "0.1 B"],
            bytes: 0,
            decimal: ["0 B", "0.1 B", "0.1 B"],
            valid: true,
        },
    },
    {
        input: "1 B",
        expected: {
            binary: ["1 B", "1 B", "1 B"],
            bytes: 1,
            decimal: ["1 B", "1 B", "1 B"],
            valid: true,
        },
    },
    {
        input: "1 kB",
        expected: {
            binary: ["1 KiB", "1 KiB", "0.98 KiB"],
            bytes: 1e3,
            decimal: ["1 kB"],
            valid: true,
        },
    },
    {
        input: "1 KiB",
        expected: {
            binary: ["1 KiB", "1 KiB", "1 KiB"],
            bytes: 1024,
            decimal: ["1 kB", "1 kB", "1.02 kB"],
            valid: true,
        },
    },
    {
        input: "1.12 kB",
        expected: {
            binary: ["1 KiB", "1.1 KiB", "1.09 KiB"],
            bytes: 1.12e3,
            decimal: ["1 kB", "1.1 kB", "1.12 kB"],
            valid: true,
        },
    },
    {
        input: "1.12 KiB",
        expected: {
            binary: ["1 KiB", "1.1 KiB", "1.12 KiB"],
            bytes: 1.147e3,
            decimal: ["1 kB", "1.1 kB", "1.15 kB"],
            valid: true,
        },
    },
    {
        input: "1.12 MB",
        expected: {
            binary: ["1 MiB", "1.1 MiB", "1.07 MiB"],
            bytes: 1.12e6,
            decimal: ["1 MB", "1.1 MB", "1.12 MB"],
            valid: true,
        },
    },
    {
        input: "1.12 MiB",
        expected: {
            binary: ["1 MiB", "1.1 MiB", "1.12 MiB"],
            bytes: 1.174405e6,
            decimal: ["1 MB", "1.2 MB", "1.17 MB"],
            valid: true,
        },
    },
    {
        input: "1.12 TB",
        expected: {
            binary: ["1 TiB", "1 TiB", "1.02 TiB"],
            bytes: 1.12e12,
            decimal: ["1 TB", "1.1 TB", "1.12 TB"],
            valid: true,
        },
    },
    {
        input: "1.12 TiB",
        expected: {
            binary: ["1 TiB", "1.1 TiB", "1.12 TiB"],
            bytes: 1.231453023109e12,
            decimal: ["1 TB", "1.2 TB", "1.23 TB"],
            valid: true,
        },
    },
    {
        input: "1.12 B",
        expected: {
            binary: ["1 B", "1.1 B", "1.12 B"],
            bytes: 1,
            decimal: ["1 B", "1.1 B", "1.12 B"],
            valid: true,
        },
    },
    {
        input: "1000 B",
        expected: {
            binary: ["1 KiB", "1 KiB", "0.98 KiB"],
            bytes: 1e3,
            decimal: ["1 kB", "1 kB", "1 kB"],
            valid: true,
        },
    },
    {
        input: "1000 kB",
        expected: {
            binary: ["1 MiB", "1 MiB", "0.95 MiB"],
            bytes: 1e6,
            decimal: ["1 MB", "1 MB", "1 MB"],
            valid: true,
        },
    },
    {
        input: "1000 KiB",
        expected: {
            binary: ["1 MiB", "1 MiB", "0.98 MiB"],
            bytes: 1.024e6,
            decimal: ["1 MB", "1 MB", "1.02 MB"],
            valid: true,
        },
    },
    {
        input: "1000.12 kB",
        expected: {
            binary: ["1 MiB", "1 MiB", "0.95 MiB"],
            bytes: 1.00012e6,
            decimal: ["1 MB", "1 MB", "1 MB", "1 MB", "1.0001 MB"],
            valid: true,
        },
    },
    {
        input: "1000.12 KiB",
        expected: {
            binary: ["1 MiB", "1 MiB", "0.98 MiB"],
            bytes: 1.024123e6,
            decimal: ["1 MB", "1 MB", "1.02 MB"],
            valid: true,
        },
    },
    {
        input: "1000.12 B",
        expected: {
            binary: ["1 KiB", "1 KiB", "0.98 KiB"],
            bytes: 1000,
            decimal: ["1 kB", "1 kB", "1 kB", "1 kB", "1.0001 kB"],
            valid: true,
        },
    },

    // Intl:
    {
        input: "1,234.56 GiB",
        expected: {
            binary: ["1 TiB", "1.2 TiB", "1.21 TiB"],
            bytes: 1.325598706237e12,
            decimal: ["1 TB", "1.3 TB", "1.33 TB"],
            valid: true,
        },
        locale: "en",
    },
    {
        input: "1 234,56 GiB",
        expected: {
            binary: ["1 TiB", "1.2 TiB", "1.21 TiB"],
            bytes: 1.325598706237e12,
            decimal: ["1 TB", "1.3 TB", "1.33 TB"],
            valid: true,
        },
        locale: "fr",
    },

    // Invalid:
    {
        input: "abc",
        expected: {
            binary: ["Invalid Bytes"],
            bytes: NaN,
            decimal: ["Invalid Bytes"],
            valid: false,
        },
    },
    {
        input: "1 Z",
        expected: {
            binary: ["Invalid Bytes"],
            bytes: NaN,
            decimal: ["Invalid Bytes"],
            valid: false,
        },
    },
];

describe("Bytes", () =>
    testData.forEach(data => {
        const b = Bytes.fromString(data.input, {locale: data.locale});

        it(`isValid: ${data.input} => ${data.expected.valid}`, () =>
            assert.equal(b.isValid(), data.expected.valid));

        it(`toBytes: ${data.input} => ${data.expected.bytes}`, () =>
            isNaN(data.expected.bytes)
                ? assert.isNaN(b.toBytes())
                : assert.equal(b.toBytes(), data.expected.bytes));

        data.expected.binary.forEach((v, digits) =>
            it(`toBinary[digits=${digits}]: ${data.input} => ${v}`, () =>
                assert.equal(b.toBinary({digits}), v)),
        );

        data.expected.decimal.forEach((v, digits) =>
            it(`toDecimal[digits=${digits}]: ${data.input} => ${v}`, () =>
                assert.equal(b.toDecimal({digits}), v)),
        );
    }));
