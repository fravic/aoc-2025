import * as R from "remeda";

type State = Array<boolean>;

type Problem = {
  target: State;
  buttons: Array<Set<number>>;
};

const compileProblem = (line: string): Problem => {
  const problemMatches = /\[((?:\.|\#)+)\]\s(\(.+\))+/.exec(line)!;
  const switchesStr = problemMatches[1];
  const target = switchesStr.split("").map((c) => (c === "." ? false : true));
  const buttonsStr = problemMatches[2];
  const buttons = buttonsStr
    .matchAll(/\(([\d,]+)\)/g)
    .map((match) => new Set(match[1].split(",").map(Number)))
    .toArray();
  return {
    target,
    buttons,
  };
};

const applyButton = (current: State, b: Set<number>): Array<boolean> =>
  current.map((c, i) => (b.has(i) ? !c : c));

const stringify = (a: State) => a.join(",");

const initialState = (p: Problem) =>
  R.range(0, p.target.length).map((_) => false);

const bfs = (p: Problem): number => {
  const queue: Array<{ s: State; d: number }> = [{ s: initialState(p), d: 0 }];
  const visited = new Set<string>();
  const targetStr = stringify(p.target);
  while (queue.length > 0) {
    const next = queue.shift()!;
    if (stringify(next.s) === targetStr) {
      return next.d;
    }
    p.buttons.forEach((b) => {
      const neighbor = applyButton(next.s, b);
      if (!visited.has(stringify(neighbor))) {
        queue.push({ s: neighbor, d: next.d + 1 });
      }
    });
  }
  return Infinity;
};

R.pipe(
  await Bun.file(Bun.argv[2] || "./p10.txt").text(),
  (text) => text.split("\n"),
  R.map(compileProblem),
  R.map(bfs),
  R.sum,
  console.log
);
