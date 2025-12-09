import * as R from "remeda";

type Box = {
  id: string;
  x: number;
  y: number;
  z: number;
  wires: Set<string>;
};

type State = {
  boxes: Array<Box>;
  grids: Array<Set<string>>;
};

const calculateDistance =
  (a: Box) =>
  (b: Box): number =>
    Math.sqrt(
      Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2) + Math.pow(b.z - a.z, 2)
    );

const compile = (soFar: State, line: string): State => {
  const [x, y, z] = line.split(",").map(Number);
  const box = { x, y, z, id: R.randomString(10), wires: new Set<string>() };
  return {
    boxes: [...soFar.boxes, box],
    grids: [...soFar.grids, new Set([box.id])],
  };
};

const findNextPair = (s: State) => {
  let candidate: { a: Box; b: Box; d: number } | null = null;
  for (let i = 0; i < s.boxes.length; i++) {
    const a = s.boxes[i];
    for (let j = i + 1; j < s.boxes.length; j++) {
      const b = s.boxes[j];
      if (a.wires.has(b.id)) {
        continue;
      }
      const d = calculateDistance(a)(b);
      if (!candidate || d < candidate.d) {
        candidate = { a, b, d };
      }
    }
  }
  return candidate;
};

const connectBoxes = (soFar: State, i: number): State => {
  const pair = findNextPair(soFar);
  if (!pair) return soFar;

  pair.a.wires.add(pair.b.id);
  pair.b.wires.add(pair.a.id);
  const aGridIdx = soFar.grids.findIndex((g) => g.has(pair.a.id))!;
  const bGridIdx = soFar.grids.findIndex((g) => g.has(pair.b.id))!;
  if (aGridIdx !== bGridIdx) {
    const minIdx = Math.min(aGridIdx, bGridIdx);
    const maxIdx = Math.max(aGridIdx, bGridIdx);
    const mergedGrid = new Set([
      ...soFar.grids[minIdx],
      ...soFar.grids[maxIdx],
    ]);
    soFar.grids = [
      ...soFar.grids.slice(0, maxIdx),
      ...soFar.grids.slice(maxIdx + 1),
    ];
    soFar.grids[minIdx] = mergedGrid;
  }
  if (soFar.grids.length === 1) {
    console.log(pair.a, pair.b);
  }
  if (i % 1000 === 0) {
    console.log(i, soFar.grids.length);
  }
  return soFar;
};

const connectUntilComplete = (state: State, iteration: number = 0): State => {
  if (state.grids.length === 1) {
    return state;
  }
  return connectUntilComplete(connectBoxes(state, iteration), iteration + 1);
};

R.pipe(
  await Bun.file(Bun.argv[2] || "./p8.txt").text(),
  (text) => text.split("\n"),
  R.reduce(compile, { boxes: [], grids: [] }),
  connectUntilComplete
);
