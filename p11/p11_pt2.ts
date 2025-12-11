import * as R from "remeda";
import memoize from "memoize";

type Graph = { [key: string]: Array<string> };

const addLineToGraph = (graph: Graph, line: string): Graph => {
  const split = line.split(": ");
  const node = split[0];
  const edges = split[1].split(" ");
  return { ...graph, [node]: edges };
};

const dfs = memoize(
  ({
    g,
    cur,
    target,
    invalids,
  }: {
    g: Graph;
    cur: string;
    target: string;
    invalids: Set<string>;
  }): number => {
    if (invalids.has(cur)) return 0;
    if (cur === target) return 1;
    return R.sum(g[cur].map((n) => dfs({ g, cur: n, target, invalids })));
  },
  { cacheKey: (args) => args[0].cur + args[0].target }
);

R.pipe(
  await Bun.file(Bun.argv[2] || "./p11.txt").text(),
  (text) => text.split("\n"),
  R.reduce(addLineToGraph, {}),
  (g) =>
    dfs({ g, cur: "svr", target: "fft", invalids: new Set(["dac", "out"]) }) *
    dfs({ g, cur: "fft", target: "dac", invalids: new Set(["out"]) }) *
    dfs({ g, cur: "dac", target: "out", invalids: new Set() }),
  console.log
);
