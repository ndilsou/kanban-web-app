import { readFile, writeFile } from "fs/promises";
import { argv } from "process";
import { Board } from "../src/domain";

async function main() {
  const filename = must(argv[2]);
  const blob = await readFile(filename);
  const { boards } = JSON.parse(blob.toString()) as { boards: Board[] };
  let boardIds = 1;
  let columnIds = 1;
  let taskIds = 1;
  boards.map((b) => {
    b.id = boardIds++;
    b.columns.map((c) => {
      c.id = columnIds++;
      c.tasks.map((t) => {
        t.id = taskIds++;
      });
    });
  });
  await writeFile(filename, JSON.stringify({ boards }));
}

function must<T>(v: T | undefined): T {
  if (typeof v === "undefined" || v === null) {
    throw Error("value must exist");
  }
  return v;
}

main();
