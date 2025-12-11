import * as R from "remeda";

type Graph = { [key: string]: Array<string> };

const addLineToGraph = (graph: Graph, line: string): Graph => {
  const split = line.split(": ");
  const node = split[0];
  const edges = split[1].split(" ");
  return { ...graph, [node]: edges };
};

const dfs = (g: Graph, cur: string): number => {
  if (cur === "out") return 1;
  return R.sum(g[cur].map((n) => dfs(g, n)));
};

R.pipe(
  await Bun.file(Bun.argv[2] || "./p11.txt").text(),
  (text) => text.split("\n"),
  R.reduce(addLineToGraph, {}),
  (g) => dfs(g, "you"),
  console.log
);
