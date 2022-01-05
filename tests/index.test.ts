import {assert} from "chai";
import {it} from "mocha";

import {Bytes} from "@/src";
import {FormatOpts, FormatUnit, ParseOpts} from "@/types";

const testData: {
    input: number | string;
    expected: {
        as?: {[K in FormatUnit]?: number};
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
        expected: {
            as: {bytes: 0, kibibytes: 0},
            valid: true,
            value: 0,
            output: "0\xa0B",
        },
        formatSpec: "%V",
    },
    {
        input: "0",
        expected: {
            as: {bytes: 0, kibibytes: 0},
            valid: true,
            value: 0,
            output: "0\xa0B",
        },
        formatSpec: "%v",
    },
    {
        input: "0 B",
        expected: {
            as: {bytes: 0, kibibytes: 0},
            valid: true,
            value: 0,
            output: "0\xa0B",
        },
        formatSpec: "%V",
    },
    {
        input: "0.12 B",
        expected: {
            as: {bytes: 0, kibibytes: 0.1171875e-3},
            valid: true,
            value: 0,
            output: "0\xa0B",
        },
        formatSpec: "%v",
    },
    {
        input: 1,
        expected: {
            as: {bytes: 1, kibibytes: 0.9765625e-3, kilobytes: 0.001},
            valid: true,
            value: 1,
            output: "1\xa0B",
        },
        formatSpec: "%V",
    },
    {
        input: "1",
        expected: {
            as: {bytes: 1, kibibytes: 0.9765625e-3, kilobytes: 0.001},
            valid: true,
            value: 1,
            output: "1\xa0B",
        },
        formatSpec: "%v",
    },
    {
        input: "1 B",
        expected: {
            as: {bytes: 1, kibibytes: 0.9765625e-3, kilobytes: 0.001},
            valid: true,
            value: 1,
            output: "1\xa0B",
        },
        formatSpec: "%V",
    },
    {
        input: "0 KiB",
        expected: {
            as: {bytes: 0, kibibytes: 0, kilobytes: 0},
            valid: true,
            value: 0,
            output: "0\xa0B",
        },
        formatSpec: "%v",
    },
    {
        input: "0kB",
        expected: {
            as: {bytes: 0, kibibytes: 0, kilobytes: 0},
            valid: true,
            value: 0,
            output: "0\xa0B",
        },
        formatSpec: "%V",
    },
    {
        input: "0kB",
        expected: {
            as: {bytes: 0, kibibytes: 0, kilobytes: 0},
            valid: true,
            value: 0,
            output: "0\xa0GB",
        },
        formatSpec: "%g",
    },
    {
        input: "0.001 kB",
        expected: {
            as: {bytes: 1, kibibytes: 0.9765625e-3, kilobytes: 0.001},
            valid: true,
            value: 1,
            output: "1\xa0B",
        },
        formatSpec: "%v",
    },
    {
        input: "0.001 kB",
        expected: {
            as: {bytes: 1, kibibytes: 0.9765625e-3, kilobytes: 0.001},
            valid: true,
            value: 1,
            output: "0\xa0GB",
        },
        formatSpec: "%g",
    },
    {
        input: "0.1 KiB",
        expected: {
            as: {bytes: 102, kibibytes: 0.1, kilobytes: 0.1024},
            valid: true,
            value: 102,
            output: "102\xa0B",
        },
        formatSpec: "%v",
    },
    {
        input: "0.1 KiB",
        expected: {
            as: {bytes: 102, kibibytes: 0.1, kilobytes: 0.1024},
            valid: true,
            value: 102,
            output: "0.1\xa0kB",
        },
        formatSpec: "%k",
    },
    {
        input: "0.1 KiB",
        expected: {
            as: {bytes: 102, kibibytes: 0.1, kilobytes: 0.1024},
            valid: true,
            value: 102,
            output: "0\xa0kB",
        },
        formatSpec: "%.k",
    },
    {
        input: "0.1 KiB",
        expected: {
            as: {bytes: 102, kibibytes: 0.1, kilobytes: 0.1024},
            valid: true,
            value: 102,
            output: "0.1\xa0KiB",
        },
        formatSpec: "%K",
    },
    {
        input: "0.1 KiB",
        expected: {
            as: {bytes: 102, kibibytes: 0.1, kilobytes: 0.1024},
            valid: true,
            value: 102,
            output: "0\xa0KiB",
        },
        formatSpec: "%.K",
    },
    {
        input: "1 kB",
        expected: {
            as: {bytes: 1e3, kibibytes: 0.9765625, kilobytes: 1},
            valid: true,
            value: 1e3,
            output: "0.98\xa0KiB",
        },
        formatSpec: "%V",
    },
    {
        input: "1 KiB",
        expected: {
            as: {bytes: 1024, kibibytes: 1, kilobytes: 1.024},
            valid: true,
            value: 1024,
            output: "1.02\xa0kB",
        },
        formatSpec: "%k",
    },
    {
        input: "1 KiB",
        expected: {
            as: {bytes: 1024, kibibytes: 1, kilobytes: 1.024},
            valid: true,
            value: 1024,
            output: "1\xa0kB",
        },
        formatSpec: "%.k",
    },
    {
        input: "1.12 kB",
        expected: {
            as: {bytes: 1.12e3, kibibytes: 1.09375, kilobytes: 1.12},
            valid: true,
            value: 1.12e3,
            output: "1.09\xa0KiB",
        },
        formatSpec: "%V",
    },
    {
        input: "1.12 kB",
        expected: {
            as: {bytes: 1.12e3, kibibytes: 1.09375, kilobytes: 1.12},
            valid: true,
            value: 1.12e3,
            output: "1\xa0KiB",
        },
        formatSpec: "%.K",
    },
    {
        input: "1.12 kB",
        expected: {
            as: {bytes: 1.12e3, kibibytes: 1.09375, kilobytes: 1.12},
            valid: true,
            value: 1.12e3,
            output: "1.1\xa0KiB",
        },
        formatSpec: "%.1K",
    },
    {
        input: "1.12 kB",
        expected: {
            as: {bytes: 1.12e3, kibibytes: 1.09375, kilobytes: 1.12},
            valid: true,
            value: 1.12e3,
            output: "0\xa0MiB",
        },
        formatSpec: "%M",
    },
    {
        input: "1.12 kB",
        expected: {
            as: {bytes: 1.12e3, kibibytes: 1.09375, kilobytes: 1.12},
            valid: true,
            value: 1.12e3,
            output: "0.001\xa0MiB",
        },
        formatSpec: "%.3M",
    },
    {
        input: "1000 B",
        expected: {
            as: {bytes: 1e3, kibibytes: 0.9765625, kilobytes: 1},
            valid: true,
            value: 1e3,
            output: "0.98\xa0KiB",
        },
        formatSpec: "%V",
    },
    {
        input: "1000 B",
        expected: {
            as: {bytes: 1e3, kibibytes: 0.9765625, kilobytes: 1},
            valid: true,
            value: 1e3,
            output: "1\xa0kB",
        },
        formatSpec: "%k",
    },
    {
        input: "1000.12 kB",
        expected: {
            as: {bytes: 1.00012e6, mebibytes: 0.9537887573242188, megabytes: 1.00012},
            valid: true,
            value: 1.00012e6,
            output: "0.95\xa0MiB",
        },
        formatSpec: "%V",
    },
    {
        input: "1000.12 kB",
        expected: {
            as: {bytes: 1.00012e6, mebibytes: 0.9537887573242188, megabytes: 1.00012},
            valid: true,
            value: 1.00012e6,
            output: "1\xa0MiB",
        },
        formatSpec: "%.1M",
    },
    {
        input: "1000.12 kB",
        expected: {
            as: {bytes: 1.00012e6, mebibytes: 0.9537887573242188, megabytes: 1.00012},
            valid: true,
            value: 1.00012e6,
            output: "1\xa0MB",
        },
        formatSpec: "%m",
    },
    {
        input: "1000.12 kB",
        expected: {
            as: {bytes: 1.00012e6, mebibytes: 0.9537887573242188, megabytes: 1.00012},
            valid: true,
            value: 1.00012e6,
            output: "1.0001\xa0MB",
        },
        formatSpec: "%.4m",
    },
    {
        input: "1000.12 B",
        expected: {
            as: {bytes: 1000, kibibytes: 0.9766796875, kilobytes: 1.00012},
            valid: true,
            value: 1000,
            output: "0.98\xa0KiB",
        },
        formatSpec: "%V",
    },
    {
        input: "1000.12 B",
        expected: {
            as: {bytes: 1000, kibibytes: 0.9766796875, kilobytes: 1.00012},
            valid: true,
            value: 1000,
            output: "0.001\xa0MB",
        },
        formatSpec: "%.4m",
    },
    {
        input: "1000.12 GiB",
        expected: {
            as: {bytes: 1.073870673019e12, gibibytes: 1000.12, gigabytes: 1.07387067301888e3},
            valid: true,
            value: 1.073870673019e12,
            output: "0.98\xa0TiB",
        },
        formatSpec: "%V",
    },
    {
        input: "1000.12 GiB",
        expected: {
            as: {bytes: 1.073870673019e12, gibibytes: 1000.12, gigabytes: 1.07387067301888e3},
            valid: true,
            value: 1.073870673019e12,
            output: "1073870.673\xa0MB",
        },
        formatSpec: "%.4m",
    },
    {
        input: "-1000.12 GiB",
        expected: {
            as: {bytes: -1.073870673019e12, gibibytes: -1000.12, gigabytes: -1.07387067301888e3},
            valid: true,
            value: -1.073870673019e12,
            output: "-0.98\xa0TiB",
        },
        formatSpec: "%V",
    },

    // With formatting options:
    {
        input: "1.12 kB",
        expected: {
            as: {bytes: 1120, kibibytes: 1.09375, kilobytes: 1.12},
            valid: true,
            value: 1.12e3,
            output: "1.12k",
        },
        formatSpec: "%!k",
    },
    {
        input: "1.12 kB",
        expected: {
            as: {bytes: 1120, kibibytes: 1.09375, kilobytes: 1.12},
            valid: true,
            value: 1.12e3,
            output: "1.09Ki",
        },
        formatSpec: "%!K",
    },
    {
        input: "1",
        expected: {
            as: {bytes: 1, kibibytes: 0.9765625e-3, kilobytes: 0.001},
            valid: true,
            value: 1,
            output: "1",
        },
        formatSpec: "%V",
        formatOpts: {suffix: false},
    },
    {
        input: "1.12 k",
        expected: {
            as: {bytes: 1.12e3, kibibytes: 1.09375, kilobytes: 1.12},
            valid: true,
            value: 1.12e3,
            output: "1.12\xa0k",
        },
        formatSpec: "%v",
        formatOpts: {suffix: false},
    },
    {
        input: "1.12 KiB",
        expected: {
            as: {bytes: 1.147e3, kibibytes: 1.12, kilobytes: 1.1468800000000001},
            valid: true,
            value: 1.147e3,
            output: "+1.15\xa0kB",
        },
        formatSpec: "%+k",
    },
    {
        input: "-1234.56Gi",
        expected: {
            as: {bytes: -1.325598706237e12, tebibytes: -1.205625, terabytes: -1.32559870623744},
            valid: true,
            value: -1.325598706237e12,
            output: "-1.33T",
        },
        formatSpec: "%!v",
    },

    // Intl:
    {
        input: "1,234.56 GiB",
        expected: {
            valid: true,
            value: 1.325598706237e12,
            output: "1.21\xa0TiB",
        },
        formatSpec: "%V",
        parseOpts: {locale: "en"},
    },
    {
        input: "1,234.56 GiB",
        expected: {
            valid: true,
            value: 1.325598706237e12,
            output: "1,33\xa0TB",
        },
        formatSpec: "%v",
        formatOpts: {locale: "fr"},
        parseOpts: {locale: "en"},
    },

    // Invalid:
    {
        input: "abc",
        expected: {
            valid: false,
            value: NaN,
            output: "Invalid Bytes",
        },
        formatSpec: "%v",
    },
    {
        input: "1,0 GiB",
        expected: {
            valid: false,
            value: NaN,
            output: "Invalid Bytes",
        },
        formatSpec: "%v",
    },
    {
        input: "1.12 AiB",
        expected: {
            valid: false,
            value: NaN,
            output: "Invalid Bytes",
        },
        formatSpec: "%v",
    },
    {
        input: "1-0 GiB",
        expected: {
            valid: false,
            value: NaN,
            output: "Invalid Bytes",
        },
        formatSpec: "%v",
    },
];

describe("Bytes", () => {
    testData.forEach(data => {
        const b =
            typeof data.input === "number"
                ? Bytes.fromBytes(data.input)
                : Bytes.fromString(data.input, data.parseOpts);

        if (data.expected.as) {
            Object.entries(data.expected.as).forEach(([unit, expected]) =>
                it(`${data.input}: as("${unit}") => ${expected}`, () =>
                    assert.equal(b.as(unit as FormatUnit), expected)),
            );
        }

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
