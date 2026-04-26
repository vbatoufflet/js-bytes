import { Bench } from "tinybench";

import { Bytes } from "../dist/index.js";

const bench = new Bench({ time: 500 });

bench
  .add("parse simple", () => {
    Bytes.fromString("123.45 MB");
  })
  .add("parse locale", () => {
    Bytes.fromString("1,234.56 GiB", { locale: "en" });
  })
  .add("format default", () => {
    Bytes.fromBytes(1024).toString();
  })
  .add("format spec", () => {
    Bytes.fromBytes(1024).toFormat("%V (%b)");
  })
  .add("convert unit", () => {
    Bytes.fromBytes(1024).as("kibibytes");
  });

await bench.run();

console.table(bench.table());
