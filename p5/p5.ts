import * as f from "@fxts/core";

type Range = {start: number; end: number};
type Parsed = {freshRanges: Array<Range>, ingredientIds: Array<number>};

const parseRange = (line: string): Range => {
  const [start, end] = line.split('-').map(Number);
  return {start, end};
};

const parseInput = (lines: Array<string>): Parsed => {
  const delimiterIndex = lines.findIndex(line => line.length === 0);
  
  const freshRanges: Range[] = f.pipe(
    lines,
    f.take(delimiterIndex >= 0 ? delimiterIndex : lines.length),
    f.map(parseRange),
    f.sortBy(range => range.start),
    f.toArray
  );

  const ingredientIds: number[] = f.pipe(
    lines,
    f.drop(delimiterIndex >= 0 ? delimiterIndex + 1 : lines.length),
    f.map(Number),
    f.toArray
  );

  return {freshRanges, ingredientIds};
};

const hasOverlap = (a: Range, b: Range): boolean =>
  !(a.start > b.end || a.end < b.start);

const isTotallyContained = (inner: Range, outer: Range): boolean =>
  inner.start > outer.start && inner.end < outer.end;

const shrinkRange = (newRange: Range, prevRange: Range): Range => {
  if (!hasOverlap(newRange, prevRange)) {
    return newRange;
  }

  if (isTotallyContained(newRange, prevRange)) {
    return {start: 0, end: -1};
  }

  const start = newRange.start >= prevRange.start 
    ? prevRange.end + 1 
    : newRange.start;
  
  const end = newRange.end <= prevRange.end 
    ? prevRange.start - 1 
    : newRange.end;

  return {start, end};
};

const rangeSize = (range: Range): number =>
  range.end >= range.start ? range.end - range.start + 1 : 0;

const processRange = (ranges: Range[]) => ([index, currentRange]: [number, Range]): Range =>
  f.reduce(shrinkRange, currentRange, f.take(index, ranges));

const countFresh = (parsed: Parsed): number =>
  f.pipe(
    parsed.freshRanges,
    f.zipWithIndex,
    f.map(processRange(parsed.freshRanges)),
    f.map(rangeSize),
    f.sum
  );

f.pipe(
  await Bun.file(Bun.argv[2] || "./p5.txt").text(),
  (text) => text.split("\n"),
  parseInput,
  countFresh,
  console.log
);
