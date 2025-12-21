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

type Placement = {
  empty: Array<boolean>; // TODO: Better way to represent this?
  shapesLeft: Array<number>;
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
    const lineRegex = /(\d+)x(\d+)\:((\s\d+)+)/g;
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

const addShapesToPlacements = (
  placements: Array<Placement>
): Array<Placement> => {
  // TODO: For each placement, try to add each shape. If a shape is added,
  // remove that placement, and add the new placement to the queue for
  // processing (so each returned placement is maximally greedy).
  return placements;
};

const getPossiblePlacements = (p: Problem): Array<Placement> => {
  if (p.w < SHAPE_SIZE || p.h < SHAPE_SIZE) {
    // No shape will fit
    return [{ empty: Array(p.w * p.h).fill(true), shapesLeft: p.shapeCounts }];
  }
  return addShapesToPlacements([
    ...getPossiblePlacements({ ...p, w: p.w - 1 }),
    ...getPossiblePlacements({ ...p, h: p.h - 1 }),
  ]);
};

const isProblemSolvable = (p: Problem): boolean => {
  const placements = getPossiblePlacements(p);
  return placements.some((pl) => pl.shapesLeft.every((c) => c === 0));
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
