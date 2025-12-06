import * as R from "remeda";

type State = Array<{
  nums: Array<number>;
  operator: "*" | "+";
}>;

const transpose = (soFar: State, line: string) => {
  const matches = line.match(/(\d+)(\s*)/g);
  if (matches) {
    matches.forEach((n, i) => {
      if (!soFar[i]) {
        soFar[i] = { nums: [], operator: "+" };
      }
      soFar[i]?.nums.push(Number(n));
    });
  } else {
    const operators = line.match(/(\+|\*)+/g);
    operators?.forEach((op, i) => {
      soFar[i].operator = op as "+" | "*";
    });
  }
  return soFar;
};

const solve = (p: State[number]) =>
  p.nums.reduce(
    (soFar, n) => (p.operator === "+" ? soFar + n : soFar * n),
    p.operator === "+" ? 0 : 1
  );

R.pipe(
  await Bun.file(Bun.argv[2] || "./p6.txt").text(),
  (t) => t.split("\n"),
  R.reduce(transpose, []),
  R.map(solve),
  R.sum,
  console.log
);
