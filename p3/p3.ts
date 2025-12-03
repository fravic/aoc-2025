import * as f from "@fxts/core";

const TARGET_NUMS = 12;

function takeLargest({ str, nums }: { str: string; nums: Array<string> }) {
  let maxIdx = 0;
  for (let i = 0; i < str.length - (TARGET_NUMS - 1 - nums.length); i++) {
    if (str[i] > str[maxIdx]) {
      maxIdx = i;
    }
  }
  return { str: str.slice(maxIdx + 1), nums: [...nums, str[maxIdx]] };
}

const concatNums = ({ nums }: { nums: Array<string> }) => Number(nums.join(""));

f.pipe(
  await Bun.file(Bun.argv[2] || "./p3.txt").text(),
  (text) => text.split("\n"),
  f.map((line) => ({ str: line, nums: [] as Array<string> })),
  f.map((i) => f.reduce(takeLargest, i, f.range(TARGET_NUMS))),
  f.map(concatNums),
  f.sum,
  f.tap(console.log)
);
