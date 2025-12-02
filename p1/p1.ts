import * as R from "remeda";

const mod = (n: number, m: number) => ((n % m) + m) % m;

const parseMove = (line: string) =>
  line.startsWith("L") ? -parseInt(line.slice(1)) : parseInt(line.slice(1));

const countPasses = (pos: number, val: number): number => {
  const absVal = Math.abs(val);
  const firstZero = val > 0 ? (100 - pos) % 100 || 100 : pos || 100;
  return firstZero <= absVal ? Math.floor((absVal - firstZero) / 100) + 1 : 0;
};

const step = (acc: { pos: number; result: number }, val: number) => ({
  pos: mod(acc.pos + val, 100),
  result: acc.result + countPasses(acc.pos, val),
});

R.pipe(
  await Bun.file(Bun.argv[2] || "./p1.txt").text(),
  R.split("\n"),
  R.map(parseMove),
  R.reduce(step, { pos: 50, result: 0 }),
  R.prop("result"),
  console.log
);
