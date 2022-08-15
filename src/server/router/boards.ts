import { createRouter } from "./context";
import { z } from "zod";
import { Board } from "@kanban/domain";
import { readFile } from "fs/promises";
import path from "path";
import { TRPCError } from "@trpc/server";
import { readFileSync } from "fs";
import { getDataSync } from "@kanban/data";
import { IterableElement } from "type-fest";

const boards = getDataSync();

export const boardsRouter = createRouter()
  .query("populate", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const board = boards.get(input.id);
      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `no Board with id ${input.id}`,
        });
      }

      const boardList: { id: number; name: string }[] = [];
      for (const b of boards.values()) {
        boardList.push({ id: b.id, name: b.name });
      }
      return { board, boardList };
    },
  })
  .query("get", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const board = boards.get(input.id);
      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `no Board with id ${input.id}`,
        });
      }
      return board;
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.number(),
      name: z.string().optional(),
      columns: z.array(z.object({ name: z.string() })),
    }),
    async resolve({ input }) {
      const board = boards.get(input.id);
      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `no Board with id ${input.id}`,
        });
      }
      const columns = input.columns.map((ic) => {
        let column = board.columns.find((c) => c.name === ic.name);
        if (!column) {
          column = { name: ic.name, tasks: [] };
        }
        return column;
      });

      const newBoard: Board = {
        id: board.id,
        name: input.name || board.name,
        columns,
      };
      boards.set(input.id, newBoard);
      return board;
    },
  })
  .query("list", {
    async resolve() {
      const boardList: { id: number; name: string }[] = [];
      for (const b of boards.values()) {
        boardList.push({ id: b.id, name: b.name });
      }
      return boardList;
    },
  });
