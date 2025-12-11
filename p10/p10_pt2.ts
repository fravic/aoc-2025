import * as R from "remeda";
import { solve, Model } from "yalps";

const solveProblem = (line: string): number => {
  const problemMatches = /(\(.+\))+\s\{(.*)\}/.exec(line)!;
  const buttonsStr = problemMatches[1];
  const buttons = buttonsStr
    .matchAll(/\(([\d,]+)\)/g)
    .map((match) => match[1].split(",").map(Number))
    .toArray();
  const targetStr = problemMatches[2];
  const targets = targetStr.split(",").map(Number);

  const model: Model = {
    direction: "minimize",
    objective: "sum",
    constraints: R.reduce(
      targets,
      (constraints, target, idx) => ({
        ...constraints,
        [`target${idx}`]: { equal: target },
      }),
      {}
    ),
    variables: R.reduce(
      buttons,
      (variable, button, idx) => ({
        ...variable,
        [`button${idx}`]: R.reduce(
          button,
          (varDef, targetIdx) => ({ ...varDef, [`target${targetIdx}`]: 1 }),
          { sum: 1 }
        ),
      }),
      {}
    ),
    integers: buttons.map((_, idx) => `button${idx}`),
  };
  const { result } = solve(model);
  return result;
};

R.pipe(
  await Bun.file(Bun.argv[2] || "./p10.txt").text(),
  (text) => text.split("\n"),
  R.map(solveProblem),
  R.sum,
  console.log
);
