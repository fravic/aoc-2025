import * as R from "remeda";
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
R.pipe(
  await Bun.file(Bun.argv[2] || "./p1.txt").text(),
  R.split("\n"),
  R.map((val) =>
    val.startsWith("L") ? -parseInt(val.slice(1)) : parseInt(val.slice(1))
  ),
  R.reduce(
    (acc, val) => {
      let pos = acc.pos;
      let result = acc.result;
      while (val !== 0) {
        if (val > 0) {
          pos = mod(pos + 1, 100);
          val--;
        } else if (val < 0) {
          pos = mod(pos - 1, 100);
          val++;
        }
        if (pos === 0) {
          result++;
        }
      }
      return {
        pos,
        result,
      };
    },
    { pos: 50, result: 0 }
  ),
  console.log
);
