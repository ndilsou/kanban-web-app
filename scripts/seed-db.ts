/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";
import { argv } from "process";
import { Board } from "../src/domain";

const prisma = new PrismaClient();

async function main() {
  const filename = must(argv[2]);
  const blob = await readFile(filename);
  const { boards } = JSON.parse(blob.toString()) as { boards: Board[] };

  const results = await Promise.allSettled(
    boards.map(({ columns, id, name }) =>
      prisma.board.create({
        data: {
          id,
          name,

          columns: {
            create: columns.map(({ name, tasks }) => ({
              name,
              tasks: {
                create: tasks.map(
                  ({ id, description, status, subtasks, title }) => ({
                    id,
                    description,
                    status,
                    title,
                    subtasks: {
                      create: subtasks.map(({ title, isCompleted }) => ({
                        title,
                        isCompleted,
                      })),
                    },
                  })
                ),
              },
            })),
          },
        },
      })
    )
  );
  console.log(results);
}

function must<T>(v: T | undefined): T {
  if (typeof v === "undefined" || v === null) {
    throw Error("value must exist");
  }
  return v;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
