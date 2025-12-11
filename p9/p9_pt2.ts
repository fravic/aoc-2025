import * as R from "remeda";
import { Box, Polygon, Point } from "@flatten-js/core";

type Tile = { x: number; y: number };

const compileTiles = (soFar: Array<Tile>, line: string): Array<Tile> => {
  const [x, y] = line.split(",").map(Number);
  return [...soFar, { x, y }];
};

const getArea = (a: Tile, b: Tile) =>
  (Math.abs(b.y - a.y) + 1) * (Math.abs(b.x - a.x) + 1);

const areAllCornersInside = (
  poly: Polygon,
  tile1: Tile,
  tile2: Tile
): boolean => {
  const xs = [tile1.x, tile2.x].sort();
  const ys = [tile1.y, tile2.y].sort();
  const corners = [
    new Point(xs[0], ys[0]),
    new Point(xs[0], ys[1]),
    new Point(xs[1], ys[0]),
    new Point(xs[1], ys[1]),
  ];
  return corners.every((corner) => poly.contains(corner));
};

const findBiggestRect = (tiles: Array<Tile>): [a: Tile, b: Tile] => {
  const poly = new Polygon(tiles.map((t) => [t.x, t.y]));
  let biggest: [Tile, Tile] = [tiles[0], tiles[1]];
  let checks = 0;
  const totalChecks = (tiles.length * (tiles.length - 1)) / 2;

  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      checks++;
      if (checks % 1000 === 0) {
        console.log(`Progress: ${checks}/${totalChecks}`);
      }

      // Checking the rect is expensive so do that last
      if (getArea(tiles[i], tiles[j]) > getArea(biggest[0], biggest[1])) {
        if (areAllCornersInside(poly, tiles[i], tiles[j])) {
          const xs = [tiles[i].x, tiles[j].x].sort();
          const ys = [tiles[i].y, tiles[j].y].sort();
          const rect = new Box(xs[0], ys[0], xs[1], ys[1]);
          if (poly.contains(rect)) {
            biggest = [tiles[i], tiles[j]];
          }
        }
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
