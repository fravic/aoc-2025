// I switched to fxts today because remeda's types don't handle generators
import * as f from "@fxts/core";

const splitFirstAndLast = (str: string): [number, number] => {
  const [first, last] = str.split("-");
  return [Number(first), Number(last)];
};

function* generateIds(ranges: Iterable<[number, number]>) {
  for (let r of ranges) {
    for (let i = r[0]; i <= r[1]; i++) yield i;
  }
}

const isIdInvalid = (i: number) => {
  const s = String(i);
  for (let j = 1; j <= s.length / 2; j++) {
    const sub = s.slice(0, j);
    const x = Math.floor(s.length / j);
    if (sub.repeat(x) === s) {
      return true;
    }
  }
  return false;
};

f.pipe(
  await Bun.file(Bun.argv[2] || "./p2.txt").text(),
  (text) => text.split(","),
  f.map(splitFirstAndLast),
  generateIds,
  f.filter(isIdInvalid),
  f.reduceLazy((acc, i) => acc + i, 0),
  f.tap(console.log)
);
