import * as R from "remeda";

type IterateResult = { numSplits: number; beamXs: Set<number> };

const iterate = (lastLine: IterateResult, line: string): IterateResult => {
  const newBeamXs = new Set<number>();
  let newNumSplits = lastLine.numSplits;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "S") {
      newBeamXs.add(i);
    } else if (line[i] === "^" && lastLine.beamXs.has(i)) {
      newBeamXs.add(i - 1).add(i + 1);
      newNumSplits++;
    } else if (lastLine.beamXs.has(i)) {
      newBeamXs.add(i);
    }
  }
  return { numSplits: newNumSplits, beamXs: newBeamXs };
};

R.pipe(
  await Bun.file(Bun.argv[2] || "./p7.txt").text(),
  (text) => text.split("\n"),
  R.reduce(iterate, { numSplits: 0, beamXs: new Set<number>() }),
  R.prop("numSplits"),
  console.log
);
