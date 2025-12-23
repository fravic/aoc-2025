import * as R from "remeda";

const SHAPE_SIZE = 3;
const NUM_SHAPES = 6;

type Shape = Array<boolean>;

type Problem = {
  w: number;
  h: number;
  shapeCounts: Array<number>;
};

type Input = {
  shapes: Array<Shape>;
  problems: Array<Problem>;
};

const parseInput = (lines: Array<string>): Input => {
  const shapes: Array<Shape> = R.range(0, NUM_SHAPES).map((_) => []);

  let lineIdx = 0;
  for (let i = 0; i < NUM_SHAPES; i++) {
    lineIdx++; // Skip shape ID
    for (let y = 0; y < SHAPE_SIZE; y++) {
      for (let x = 0; x < SHAPE_SIZE; x++) {
        shapes[i].push(lines[lineIdx].charAt(x) === "#" ? true : false);
      }
      lineIdx++;
    }
    lineIdx++; // Skip newline
  }

  const problems: Array<Problem> = [];
  for (let i = lineIdx; i < lines.length; i++) {
    const lineRegex = /(\d+)x(\d+)\:\s((\d+\s?)+)/g;
    const lineRes = lineRegex.exec(lines[i])!;
    const shapeCounts = lineRes[3].split(" ").map(Number);
    problems.push({
      w: Number(lineRes[1]),
      h: Number(lineRes[2]),
      shapeCounts,
    });
  }

  return { shapes, problems };
};

const calculateAreaForPair = (
  count: number,
  pairWidth: number,
  pairHeight: number
): number => {
  if (count % 2 === 0) {
    return (count / 2) * pairWidth * pairHeight;
  }
  // If there are an odd number, let's assume that the extra tile will take up its full area
  return ((count - 1) / 2) * pairWidth * pairHeight + SHAPE_SIZE * SHAPE_SIZE;
};

const getDimensionsOfPair = (shapeIdx: number): [number, number] => {
  switch (shapeIdx) {
    case 0:
      // Shape 0
      // Two of them fit into a 4x5 grid, but the bottom row can be tiled into another row, so consider it 4x4
      return [4, 4];
    case 1:
      // Shape 1
      // Two of them fill a 3x5, with a space in the middle
      return [3, 5];
    case 2:
      // Shape 2
      // Two of them fit into a 4x5, but the right row can be tiled into another row, so consider it 4x4
      return [4, 4];
    case 3:
      // Shape 3
      // Two of them fit into a 4x4
      return [4, 4];
    case 4:
      // Shape 4
      // Two of them fit into a 4x3
      return [4, 3];
    case 5:
      // Shape 5
      // Two of them fit into a 4x3
      return [4, 3];
    default:
      throw new Error("Unknown shape");
  }
};

const areaForShapeCount = (p: Problem, shapeIdx: number, count: number) => {
  const [pairWidth, pairHeight] = getDimensionsOfPair(shapeIdx);
  return calculateAreaForPair(count, pairWidth, pairHeight);
};

const isProblemSolvable = (p: Problem): boolean => {
  const totalArea = R.reduce(
    p.shapeCounts.entries().toArray(),
    (total, [i, count]) => total + areaForShapeCount(p, i, count),
    0
  );
  return totalArea <= p.w * p.h;
};

const countSolvableProblems = (p: Input) =>
  R.reduce(
    p.problems,
    (soFar, p) => (isProblemSolvable(p) ? soFar + 1 : soFar),
    0
  );

R.pipe(
  await Bun.file(Bun.argv[2] || "./p12.txt").text(),
  (txt) => txt.split("\n"),
  parseInput,
  countSolvableProblems,
  console.log
);
