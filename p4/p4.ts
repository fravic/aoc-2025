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

const countAdjacentRolls = (grid: Grid, x: number, y: number): number =>
  f.pipe(
    adj(x, y),
    f.filter((c) => grid.has(c)),
    f.size
  );

const isRollRemovable = (grid: Grid, x: number, y: number): boolean =>
  countAdjacentRolls(grid, x, y) < 4;

function performRemoval(state: GameState): { grid: Grid; removed: number } {
  const coordsToRemove = f.pipe(
    allCoords(state.w, state.h),
    f.map(({ x, y }) => ({ x, y, coord: coordStr(x, y) })),
    f.filter(({ coord }) => state.grid.has(coord)),
    f.filter(({ x, y }) => isRollRemovable(state.grid, x, y)),
    f.map(({ coord }) => coord),
    f.toArray
  );
  const newGrid = new Set(
    f.pipe(
      state.grid,
      f.filter((coord) => !coordsToRemove.includes(coord))
    )
  );
  return { grid: newGrid, removed: coordsToRemove.length };
}

const removeUntilStable = (state: GameState): number => {
  const { grid, removed } = performRemoval(state);
  return removed === 0 ? 0 : removed + removeUntilStable({ ...state, grid });
};

f.pipe(
  await Bun.file(Bun.argv[2] || "./p4.txt").text(),
  buildMap,
  removeUntilStable,
  console.log
);
