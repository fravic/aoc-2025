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
  for (const a of s.boxes) {
    for (const b of s.boxes) {
      if (a.wires.has(b.id) || a.id === b.id) {
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
  pair?.a.wires.add(pair.b.id);
  pair?.b.wires.add(pair.a.id);
  const aGridIdx = soFar.grids.findIndex((g) => g.has(pair!.a.id))!;
  const bGridIdx = soFar.grids.findIndex((g) => g.has(pair!.b.id))!;
  if (aGridIdx !== bGridIdx) {
    const aGrid = soFar.grids[aGridIdx];
    const bGrid = soFar.grids[bGridIdx];
    for (const v of bGrid) {
      aGrid.add(v);
    }
    soFar.grids = [
      ...soFar.grids.slice(0, bGridIdx),
      ...soFar.grids.slice(bGridIdx + 1),
    ];
  }
  if (soFar.grids.length === 1) {
    console.log(pair!.a, pair!.b);
  }
  if (i % 1000 === 0) {
    console.log(i, soFar.grids.length);
  }
  return soFar;
};

R.pipe(
  await Bun.file(Bun.argv[2] || "./p8.txt").text(),
  (text) => text.split("\n"),
  R.reduce(compile, { boxes: [], grids: [] }),
  (s) => {
    let i = 0;
    do {
      connectBoxes(s, i++);
    } while (s.grids.length > 1);
  }
);
