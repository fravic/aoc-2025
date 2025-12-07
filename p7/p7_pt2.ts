import * as R from "remeda";
import memoize from "memoize";

const recurse = memoize(
  (lines: Array<string>, curLine: number, beamX: number): number => {
    const line = lines[curLine];
    if (!line) {
      return 1;
    }
    if (line[beamX] === "^") {
      return (
        recurse(lines, curLine + 1, beamX - 1) +
        recurse(lines, curLine + 1, beamX + 1)
      );
    }
    return recurse(lines, curLine + 1, beamX);
  },
  { cacheKey: (args) => `${args[1]}_${args[2]}` }
);

R.pipe(
  await Bun.file(Bun.argv[2] || "./p7.txt").text(),
  (text) => text.split("\n"),
  (lines) => recurse(lines, 0, lines[0].indexOf("S")),
  console.log
);
