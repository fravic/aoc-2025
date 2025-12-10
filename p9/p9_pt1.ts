import * as R from "remeda";

type Tile = { x: number; y: number };

const compileTiles = (soFar: Array<Tile>, line: string): Array<Tile> => {
  const [x, y] = line.split(",").map(Number);
  return [...soFar, { x, y }];
};

const getArea = (a: Tile, b: Tile) =>
  (Math.abs(b.y - a.y) + 1) * (Math.abs(b.x - a.x) + 1);

const findBiggestRect = (tiles: Array<Tile>): [a: Tile, b: Tile] => {
  let biggest: [Tile, Tile] = [tiles[0], tiles[1]];
  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (getArea(tiles[i], tiles[j]) > getArea(biggest[0], biggest[1])) {
        biggest = [tiles[i], tiles[j]];
      }
    }
  }
  return biggest;
};

R.pipe(
  await Bun.file(Bun.argv[2] || "./p9.txt").text(),
  (text) => text.split("\n"),
  R.reduce(compileTiles, []),
  findBiggestRect,
  ([a, b]) => getArea(a, b),
  console.log
);
