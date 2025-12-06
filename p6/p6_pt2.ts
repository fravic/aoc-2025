import * as R from "remeda";

type Problems = Array<{
  nums: Array<number>;
  operator: "*" | "+";
}>;

const getBoundingBoxes = (
  lastLine: string
): Array<{ x: number; w: number }> => {
  const boundingBoxes: Array<{ x: number; w: number }> = [];
  for (let i = 0; i < lastLine.length; i++) {
    if (lastLine[i] !== " ") {
      let nextOpIdx = i + 1;
      while (nextOpIdx < lastLine.length && lastLine[nextOpIdx] === " ") {
        nextOpIdx++;
      }
      const width =
        nextOpIdx < lastLine.length ? nextOpIdx - i - 1 : lastLine.length - i;
      boundingBoxes.push({ x: i, w: width });
    }
  }
  return boundingBoxes;
};

const getProblems =
  (lines: Array<string>) =>
  (soFar: Problems, bb: { x: number; w: number }): Problems => {
    const nums = [];
    for (let x = bb.x; x < bb.x + bb.w; x++) {
      let num = "";
      for (let y = 0; y < lines.length - 1; y++) {
        num += lines[y][x];
      }
      nums.push(num);
    }
    return [
      ...soFar,
      {
        nums: nums.map(Number),
        operator: lines[lines.length - 1][bb.x] as "+" | "*",
      },
    ];
  };

const solve = (p: Problems[number]) =>
  p.nums.reduce(
    (soFar, n) => (p.operator === "+" ? soFar + n : soFar * n),
    p.operator === "+" ? 0 : 1
  );

R.pipe(
  await Bun.file(Bun.argv[2] || "./p6.txt").text(),
  (t) => t.split("\n"),
  (lines) => {
    const boundingBoxes = getBoundingBoxes(lines[lines.length - 1]);
    return R.reduce(boundingBoxes, getProblems(lines), []);
  },
  R.map(solve),
  R.sum,
  console.log
);
