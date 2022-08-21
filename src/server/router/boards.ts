import { getDataSync } from "@kanban/data";
import { Board } from "@kanban/domain";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

const boards = getDataSync();
const prisma = new PrismaClient();

export const boardsRouter = createRouter()
  .query("get", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const board = await prisma.board.findUnique({
        where: { id: input.id },
        include: {
          columns: { include: { tasks: { include: { subtasks: true } } } },
        },
      });
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
      const boards = await prisma.board.findMany({
        select: { id: true, name: true },
      });
      return boards;
    },
  });
