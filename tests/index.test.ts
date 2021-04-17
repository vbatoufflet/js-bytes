import {assert} from "chai";
import {it} from "mocha";

import {Bytes} from "@/src";
import {FormatBinaryUnit, FormatDecimalUnit, FormatOpts, ParseOpts} from "@/types";

const testData: {
    input: string;
    expected: {
        binary: string[];
        bytes: number;
        decimal: string[];
        valid: boolean;
    };
    format?: FormatOpts;
    parse?: ParseOpts;
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
            binary: ["1\xa0B", "1\xa0B", "1\xa0B"],
            bytes: 1,
            decimal: ["1\xa0B", "1\xa0B", "1\xa0B"],
            valid: true,
        },
    },
    {
        input: "0.1 KiB",
        expected: {
            binary: ["102\xa0B", "102.4\xa0B", "102.4\xa0B"],
            bytes: 102,
            decimal: ["102\xa0B", "102.4\xa0B", "102.4\xa0B"],
            valid: true,
        },
    },
    {
        input: "0.1 B",
        expected: {
            binary: ["0\xa0B", "0.1\xa0B", "0.1\xa0B"],
            bytes: 0,
            decimal: ["0\xa0B", "0.1\xa0B", "0.1\xa0B"],
            valid: true,
        },
    },
    {
        input: "1 B",
        expected: {
            binary: ["1\xa0B", "1\xa0B", "1\xa0B"],
            bytes: 1,
            decimal: ["1\xa0B", "1\xa0B", "1\xa0B"],
            valid: true,
        },
    },
    {
        input: "1 kB",
        expected: {
            binary: ["1\xa0KiB", "1\xa0KiB", "0.98\xa0KiB"],
            bytes: 1e3,
            decimal: ["1\xa0kB"],
            valid: true,
        },
    },
    {
        input: "1 KiB",
        expected: {
            binary: ["1\xa0KiB", "1\xa0KiB", "1\xa0KiB"],
            bytes: 1024,
            decimal: ["1\xa0kB", "1\xa0kB", "1.02\xa0kB"],
            valid: true,
        },
    },
    {
        input: "1.12 kB",
        expected: {
            binary: ["1\xa0KiB", "1.1\xa0KiB", "1.09\xa0KiB"],
            bytes: 1.12e3,
            decimal: ["1\xa0kB", "1.1\xa0kB", "1.12\xa0kB"],
            valid: true,
        },
    },
    {
        input: "1.12 KiB",
        expected: {
            binary: ["1\xa0KiB", "1.1\xa0KiB", "1.12\xa0KiB"],
            bytes: 1.147e3,
            decimal: ["1\xa0kB", "1.1\xa0kB", "1.15\xa0kB"],
            valid: true,
        },
    },
    {
        input: "1.12 MB",
        expected: {
            binary: ["1\xa0MiB", "1.1\xa0MiB", "1.07\xa0MiB"],
            bytes: 1.12e6,
            decimal: ["1\xa0MB", "1.1\xa0MB", "1.12\xa0MB"],
            valid: true,
        },
    },
    {
        input: "1.12 MiB",
        expected: {
            binary: ["1\xa0MiB", "1.1\xa0MiB", "1.12\xa0MiB"],
            bytes: 1.174405e6,
            decimal: ["1\xa0MB", "1.2\xa0MB", "1.17\xa0MB"],
            valid: true,
        },
    },
    {
        input: "1.12 TB",
        expected: {
            binary: ["1\xa0TiB", "1\xa0TiB", "1.02\xa0TiB"],
            bytes: 1.12e12,
            decimal: ["1\xa0TB", "1.1\xa0TB", "1.12\xa0TB"],
            valid: true,
        },
    },
    {
        input: "1.12 TiB",
        expected: {
            binary: ["1\xa0TiB", "1.1\xa0TiB", "1.12\xa0TiB"],
            bytes: 1.231453023109e12,
            decimal: ["1\xa0TB", "1.2\xa0TB", "1.23\xa0TB"],
            valid: true,
        },
    },
    {
        input: "1.12 B",
        expected: {
            binary: ["1\xa0B", "1.1\xa0B", "1.12\xa0B"],
            bytes: 1,
            decimal: ["1\xa0B", "1.1\xa0B", "1.12\xa0B"],
            valid: true,
        },
    },
    {
        input: "1000 B",
        expected: {
            binary: ["1\xa0KiB", "1\xa0KiB", "0.98\xa0KiB"],
            bytes: 1e3,
            decimal: ["1\xa0kB", "1\xa0kB", "1\xa0kB"],
            valid: true,
        },
    },
    {
        input: "1000 kB",
        expected: {
            binary: ["1\xa0MiB", "1\xa0MiB", "0.95\xa0MiB"],
            bytes: 1e6,
            decimal: ["1\xa0MB", "1\xa0MB", "1\xa0MB"],
            valid: true,
        },
    },
    {
        input: "1000 KiB",
        expected: {
            binary: ["1\xa0MiB", "1\xa0MiB", "0.98\xa0MiB"],
            bytes: 1.024e6,
            decimal: ["1\xa0MB", "1\xa0MB", "1.02\xa0MB"],
            valid: true,
        },
    },
    {
        input: "1000.12 kB",
        expected: {
            binary: ["1\xa0MiB", "1\xa0MiB", "0.95\xa0MiB"],
            bytes: 1.00012e6,
            decimal: ["1\xa0MB", "1\xa0MB", "1\xa0MB", "1\xa0MB", "1.0001\xa0MB"],
            valid: true,
        },
    },
    {
        input: "1000.12 KiB",
        expected: {
            binary: ["1\xa0MiB", "1\xa0MiB", "0.98\xa0MiB"],
            bytes: 1.024123e6,
            decimal: ["1\xa0MB", "1\xa0MB", "1.02\xa0MB"],
            valid: true,
        },
    },
    {
        input: "1000.12 B",
        expected: {
            binary: ["1\xa0KiB", "1\xa0KiB", "0.98\xa0KiB"],
            bytes: 1000,
            decimal: ["1\xa0kB", "1\xa0kB", "1\xa0kB", "1\xa0kB", "1.0001\xa0kB"],
            valid: true,
        },
    },
    {
        input: "-1000.12 B",
        expected: {
            binary: ["-1\xa0KiB", "-1\xa0KiB", "-0.98\xa0KiB"],
            bytes: -1000,
            decimal: ["-1\xa0kB", "-1\xa0kB", "-1\xa0kB", "-1\xa0kB", "-1.0001\xa0kB"],
            valid: true,
        },
    },

    // With formatting options:
    {
        input: "1.12kB",
        expected: {
            binary: ["1\xa0KiB", "1.1\xa0KiB", "1.09\xa0KiB"],
            bytes: 1.12e3,
            decimal: ["1\xa0kB", "1.1\xa0kB", "1.12\xa0kB"],
            valid: true,
        },
    },
    {
        input: "1.12 kB",
        expected: {
            binary: ["1KiB", "1.1KiB", "1.09KiB"],
            bytes: 1.12e3,
            decimal: ["1kB", "1.1kB", "1.12kB"],
            valid: true,
        },
        format: {
            space: false,
        },
    },
    {
        input: "1",
        expected: {
            binary: ["1", "1", "1"],
            bytes: 1,
            decimal: ["1", "1", "1"],
            valid: true,
        },
        format: {
            suffix: false,
        },
    },
    {
        input: "1.12 k",
        expected: {
            binary: ["1\xa0Ki", "1.1\xa0Ki", "1.09\xa0Ki"],
            bytes: 1.12e3,
            decimal: ["1\xa0k", "1.1\xa0k", "1.12\xa0k"],
            valid: true,
        },
        format: {
            suffix: false,
        },
    },
    {
        input: "1.12 Ki",
        expected: {
            binary: ["1\xa0Ki", "1.1\xa0Ki", "1.12\xa0Ki"],
            bytes: 1.147e3,
            decimal: ["1\xa0k", "1.1\xa0k", "1.15\xa0k"],
            valid: true,
        },
        format: {
            suffix: false,
        },
    },
    {
        input: "1.12 KiB",
        expected: {
            binary: ["+1\xa0KiB", "+1.1\xa0KiB", "+1.12\xa0KiB"],
            bytes: 1.147e3,
            decimal: ["+1\xa0kB", "+1.1\xa0kB", "+1.15\xa0kB"],
            valid: true,
        },
        format: {
            sign: true,
        },
    },
    {
        input: "1234.56Gi",
        expected: {
            binary: ["1Ti", "1.2Ti", "1.21Ti"],
            bytes: 1.325598706237e12,
            decimal: ["1T", "1.3T", "1.33T"],
            valid: true,
        },
        format: {
            space: false,
            suffix: false,
        },
    },
    {
        input: "1.12 MB",
        expected: {
            binary: ["1094\xa0KiB", "1093.8\xa0KiB", "1093.75\xa0KiB"],
            bytes: 1.12e6,
            decimal: [],
            valid: true,
        },
        format: {
            unit: "kibibyte",
        },
    },
    {
        input: "1.12 MiB",
        expected: {
            binary: [],
            bytes: 1.174405e6,
            decimal: ["1174\xa0kB", "1174.4\xa0kB", "1174.41\xa0kB"],
            valid: true,
        },
        format: {
            unit: "kilobyte",
        },
    },

    // Intl:
    {
        input: "1,234.56 GiB",
        expected: {
            binary: ["1\xa0TiB", "1.2\xa0TiB", "1.21\xa0TiB"],
            bytes: 1.325598706237e12,
            decimal: ["1\xa0TB", "1.3\xa0TB", "1.33\xa0TB"],
            valid: true,
        },
        parse: {
            locale: "en",
        },
    },
    {
        input: "1 234,56 GiB",
        expected: {
            binary: ["1\xa0TiB", "1.2\xa0TiB", "1.21\xa0TiB"],
            bytes: 1.325598706237e12,
            decimal: ["1\xa0TB", "1.3\xa0TB", "1.33\xa0TB"],
            valid: true,
        },
        parse: {
            locale: "fr",
        },
    },
    {
        input: "-1 234,56 GiB",
        expected: {
            binary: ["-1\xa0TiB", "-1.2\xa0TiB", "-1.21\xa0TiB"],
            bytes: -1.325598706237e12,
            decimal: ["-1\xa0TB", "-1.3\xa0TB", "-1.33\xa0TB"],
            valid: true,
        },
        parse: {
            locale: "fr",
        },
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
        input: "1,0 GiB",
        expected: {
            binary: ["Invalid Bytes"],
            bytes: NaN,
            decimal: ["Invalid Bytes"],
            valid: false,
        },
    },
    {
        input: "1-0 GiB",
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
        const b = Bytes.fromString(data.input, data.parse);

        it(`${data.input}: isValid`, () => assert.equal(b.isValid(), data.expected.valid));

        it(`${data.input}: toBytes`, () =>
            isNaN(data.expected.bytes)
                ? assert.isNaN(b.toBytes())
                : assert.equal(b.toBytes(), data.expected.bytes));

        data.expected.binary.forEach((v, digits) =>
            it(`${data.input}: toBinary[digits=${digits}]`, () =>
                assert.equal(
                    b.toBinary({...data.format, digits} as FormatOpts<FormatBinaryUnit>),
                    v,
                )),
        );

        data.expected.decimal.forEach((v, digits) =>
            it(`${data.input}: toDecimal[digits=${digits}]`, () =>
                assert.equal(
                    b.toDecimal({...data.format, digits} as FormatOpts<FormatDecimalUnit>),
                    v,
                )),
        );
    }));
