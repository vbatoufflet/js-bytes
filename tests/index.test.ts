import {assert} from "chai";
import {it} from "mocha";

import {Bytes} from "@/src";
import {FormatOpts, ParseOpts} from "@/types";

const testData: {
    input: number | string;
    expected: {
        value: number;
        output: string;
        valid: boolean;
    };
    formatSpec: string;
    formatOpts?: FormatOpts;
    parseOpts?: ParseOpts;
}[] = [
    {
        input: 0,
        expected: {valid: true, value: 0, output: "0\xa0B"},
        formatSpec: "%V",
    },
    {
        input: "0",
        expected: {valid: true, value: 0, output: "0\xa0B"},
        formatSpec: "%v",
    },
    {
        input: "0 B",
        expected: {valid: true, value: 0, output: "0\xa0B"},
        formatSpec: "%V",
    },
    {
        input: "0.12 B",
        expected: {valid: true, value: 0, output: "0\xa0B"},
        formatSpec: "%v",
    },
    {
        input: 1,
        expected: {valid: true, value: 1, output: "1\xa0B"},
        formatSpec: "%V",
    },
    {
        input: "1",
        expected: {valid: true, value: 1, output: "1\xa0B"},
        formatSpec: "%v",
    },
    {
        input: "1 B",
        expected: {valid: true, value: 1, output: "1\xa0B"},
        formatSpec: "%V",
    },
    {
        input: "0 KiB",
        expected: {valid: true, value: 0, output: "0\xa0B"},
        formatSpec: "%v",
    },
    {
        input: "0kB",
        expected: {valid: true, value: 0, output: "0\xa0B"},
        formatSpec: "%V",
    },
    {
        input: "0kB",
        expected: {valid: true, value: 0, output: "0\xa0GB"},
        formatSpec: "%g",
    },
    {
        input: "0.001 kB",
        expected: {valid: true, value: 1, output: "1\xa0B"},
        formatSpec: "%v",
    },
    {
        input: "0.001 kB",
        expected: {valid: true, value: 1, output: "0\xa0GB"},
        formatSpec: "%g",
    },
    {
        input: "0.1 KiB",
        expected: {valid: true, value: 102, output: "102\xa0B"},
        formatSpec: "%v",
    },
    {
        input: "0.1 KiB",
        expected: {valid: true, value: 102, output: "0.1\xa0kB"},
        formatSpec: "%k",
    },
    {
        input: "0.1 KiB",
        expected: {valid: true, value: 102, output: "0\xa0kB"},
        formatSpec: "%.k",
    },
    {
        input: "0.1 KiB",
        expected: {valid: true, value: 102, output: "0.1\xa0KiB"},
        formatSpec: "%K",
    },
    {
        input: "0.1 KiB",
        expected: {valid: true, value: 102, output: "0\xa0KiB"},
        formatSpec: "%.K",
    },
    {
        input: "1 kB",
        expected: {valid: true, value: 1e3, output: "0.98\xa0KiB"},
        formatSpec: "%V",
    },
    {
        input: "1 KiB",
        expected: {valid: true, value: 1024, output: "1.02\xa0kB"},
        formatSpec: "%k",
    },
    {
        input: "1 KiB",
        expected: {valid: true, value: 1024, output: "1\xa0kB"},
        formatSpec: "%.k",
    },
    {
        input: "1.12 kB",
        expected: {valid: true, value: 1.12e3, output: "1.09\xa0KiB"},
        formatSpec: "%V",
    },
    {
        input: "1.12 kB",
        expected: {valid: true, value: 1.12e3, output: "1\xa0KiB"},
        formatSpec: "%.K",
    },
    {
        input: "1.12 kB",
        expected: {valid: true, value: 1.12e3, output: "1.1\xa0KiB"},
        formatSpec: "%.1K",
    },
    {
        input: "1.12 kB",
        expected: {valid: true, value: 1.12e3, output: "0\xa0MiB"},
        formatSpec: "%M",
    },
    {
        input: "1.12 kB",
        expected: {valid: true, value: 1.12e3, output: "0.001\xa0MiB"},
        formatSpec: "%.3M",
    },
    {
        input: "1000 B",
        expected: {valid: true, value: 1e3, output: "0.98\xa0KiB"},
        formatSpec: "%V",
    },
    {
        input: "1000 B",
        expected: {valid: true, value: 1e3, output: "1\xa0kB"},
        formatSpec: "%k",
    },
    {
        input: "1000.12 kB",
        expected: {valid: true, value: 1.00012e6, output: "0.95\xa0MiB"},
        formatSpec: "%V",
    },
    {
        input: "1000.12 kB",
        expected: {valid: true, value: 1.00012e6, output: "1\xa0MiB"},
        formatSpec: "%.1M",
    },
    {
        input: "1000.12 kB",
        expected: {valid: true, value: 1.00012e6, output: "1\xa0MB"},
        formatSpec: "%m",
    },
    {
        input: "1000.12 kB",
        expected: {valid: true, value: 1.00012e6, output: "1.0001\xa0MB"},
        formatSpec: "%.4m",
    },
    {
        input: "1000.12 B",
        expected: {valid: true, value: 1000, output: "0.98\xa0KiB"},
        formatSpec: "%V",
    },
    {
        input: "1000.12 B",
        expected: {valid: true, value: 1000, output: "0.001\xa0MB"},
        formatSpec: "%.4m",
    },
    {
        input: "1000.12 GiB",
        expected: {valid: true, value: 1.073870673019e12, output: "0.98\xa0TiB"},
        formatSpec: "%V",
    },
    {
        input: "1000.12 GiB",
        expected: {valid: true, value: 1.073870673019e12, output: "1073870.673\xa0MB"},
        formatSpec: "%.4m",
    },
    {
        input: "-1000.12 GiB",
        expected: {valid: true, value: -1.073870673019e12, output: "-0.98\xa0TiB"},
        formatSpec: "%V",
    },

    // With formatting options:
    {
        input: "1.12 kB",
        expected: {valid: true, value: 1.12e3, output: "1.12k"},
        formatSpec: "%!k",
    },
    {
        input: "1.12 kB",
        expected: {valid: true, value: 1.12e3, output: "1.09Ki"},
        formatSpec: "%!K",
    },
    {
        input: "1",
        expected: {valid: true, value: 1, output: "1"},
        formatSpec: "%V",
        formatOpts: {suffix: false},
    },
    {
        input: "1.12 k",
        expected: {valid: true, value: 1.12e3, output: "1.12\xa0k"},
        formatSpec: "%v",
        formatOpts: {suffix: false},
    },
    {
        input: "1.12 KiB",
        expected: {valid: true, value: 1.147e3, output: "+1.15\xa0kB"},
        formatSpec: "%+k",
    },
    {
        input: "-1234.56Gi",
        expected: {valid: true, value: -1.325598706237e12, output: "-1.33T"},
        formatSpec: "%!v",
    },

    // Intl:
    {
        input: "1,234.56 GiB",
        expected: {valid: true, value: 1.325598706237e12, output: "1.21\xa0TiB"},
        formatSpec: "%V",
        parseOpts: {locale: "en"},
    },
    {
        input: "1,234.56 GiB",
        expected: {valid: true, value: 1.325598706237e12, output: "1,33\xa0TB"},
        formatSpec: "%v",
        formatOpts: {locale: "fr"},
        parseOpts: {locale: "en"},
    },

    // Invalid:
    {
        input: "abc",
        expected: {valid: false, value: NaN, output: "Invalid Bytes"},
        formatSpec: "%v",
    },
    {
        input: "1,0 GiB",
        expected: {valid: false, value: NaN, output: "Invalid Bytes"},
        formatSpec: "%v",
    },
    {
        input: "1.12 AiB",
        expected: {valid: false, value: NaN, output: "Invalid Bytes"},
        formatSpec: "%v",
    },
    {
        input: "1-0 GiB",
        expected: {valid: false, value: NaN, output: "Invalid Bytes"},
        formatSpec: "%v",
    },
];

describe("Bytes", () => {
    testData.forEach(data => {
        const b =
            typeof data.input === "number"
                ? Bytes.fromBytes(data.input)
                : Bytes.fromString(data.input, data.parseOpts);

        it(`${data.input}: isValid() => ${data.expected.valid}`, () =>
            assert.equal(b.isValid(), data.expected.valid));

        if (data.formatSpec) {
            it(`${data.input}: toFormat("${data.formatSpec}") => "${data.expected.output}"`, () =>
                assert.equal(
                    b.toFormat(data.formatSpec as string, data.formatOpts),
                    data.expected.output,
                ));
        } else {
            it(`${data.input}: toString() => "${data.expected.output}"`, () =>
                assert.equal(b.toString(data.formatOpts), data.expected.output));
        }

        it(`${data.input}: valueOf() => ${data.expected.value}`, () =>
            isNaN(data.expected.value)
                ? assert.isNaN(b.valueOf())
                : assert.equal(b.valueOf(), data.expected.value));
    });
});
