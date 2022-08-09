import { createRouter } from "./context";
import { z } from "zod";
import { Board } from "@kanban/domain";
import { readFile } from "fs/promises";
import path from "path";
import { TRPCError } from "@trpc/server";
import { readFileSync } from "fs";
import { getDataSync } from "@kanban/data";

const boards = getDataSync();

export const boardsRouter = createRouter()
  .query("populate", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const board = boards.find((b) => b.id === input.id);
      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `no Board with id ${input.id}`,
        });
      }
      const boardList = boards.map((b) => ({ id: b.id, name: b.name }));
      return { board, boardList };
    },
  })
  .query("get", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const board = boards.find((b) => b.id === input.id);
      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `no Board with id ${input.id}`,
        });
      }
      return board;
    },
  })
  .query("listNames", {
    async resolve() {
      const names = boards.map((b) => b.name);
      return names;
    },
  });
