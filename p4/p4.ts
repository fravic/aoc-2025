import * as f from "@fxts/core";

const coordStr = (x: number, y: number) => `${x},${y}`;

function* adj(x: number, y: number) {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) {
        yield coordStr(x + dx, y + dy);
      }
    }
  }
}

function* allCoords(w: number, h: number) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      yield { x, y };
    }
  }
}

type Grid = Set<string>;

type GameState = {
  grid: Grid;
  w: number;
  h: number;
};

function buildMap(text: string): GameState {
  const lines = text.split("\n");
  const grid = new Set<string>(
    lines.flatMap((line, y) =>
      [...line]
        .map((char, x) => ({ char, coord: coordStr(x, y) }))
        .filter(({ char }) => char === "@")
        .map(({ coord }) => coord)
    )
  );
  return {
    grid,
    w: lines[0].length,
    h: lines.length,
  };
}

const countAdjacent =
  (grid: Grid) =>
  (coord: string): number => {
    const [x, y] = coord.split(",").map(Number);
    return f.pipe(adj(x, y), f.filter(grid.has.bind(grid)), f.size);
  };

const isRemovable =
  (state: GameState) =>
  (coord: string): boolean =>
    countAdjacent(state.grid)(coord) < 4;

const difference = <T>(a: Set<T>, b: Set<T>): Set<T> =>
  new Set([...a].filter((x) => !b.has(x)));

const performRemoval = (state: GameState): [Grid, number] => {
  const toRemove = new Set(
    f.pipe(
      allCoords(state.w, state.h),
      f.map(({ x, y }) => coordStr(x, y)),
      f.filter((coord) => state.grid.has(coord)),
      f.filter(isRemovable(state))
    )
  );
  return [difference(state.grid, toRemove), toRemove.size];
};

const removeUntilStable = (state: GameState): number => {
  const [grid, removed] = performRemoval(state);
  return removed === 0 ? 0 : removed + removeUntilStable({ ...state, grid });
};

f.pipe(
  await Bun.file(Bun.argv[2] || "./p4.txt").text(),
  buildMap,
  removeUntilStable,
  console.log
);
