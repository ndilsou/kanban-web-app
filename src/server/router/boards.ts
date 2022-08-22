import { TaskSchema } from "@kanban/data";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

const ALLOW_DELETE = true;
const prisma = new PrismaClient();

export const CreateTaskSchema = z.object({
  task: z.object({
    columnId: z.number(),
    title: z.string().min(1),
    description: z.string(),
    subtasks: z
      .object({
        title: z.string().min(1),
        isCompleted: z.boolean(),
      })
      .array(),
  }),
});

export const UpdateTaskSchema = z.object({
  id: z.number(),
  columnId: z.number(),
  title: z.string().min(1),
  description: z.string(),
  subtasks: z
    .object({
      id: z.number().optional(),
      title: z.string().min(1),
      isCompleted: z.boolean().optional(),
    })
    .array(),
});

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
  .query("getTask", {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      const task = await prisma.task.findUnique({
        where: { id: input.id },
        include: { subtasks: true },
      });
      return task;
    },
  })
  .query("list", {
    async resolve() {
      const boards = await prisma.board.findMany({
        select: { id: true, name: true },
      });
      return boards;
    },
  })
  .query("listColumns", {
    input: z.object({ boardId: z.number() }),
    async resolve({ input: { boardId } }) {
      const boards = await prisma.column.findMany({
        where: { boardId },
        select: { id: true, name: true },
      });
      return boards;
    },
  })
  .mutation("create", {
    input: z.object({ name: z.string(), columns: z.string().array() }),
    async resolve({ input }) {
      const board = await prisma.board.create({
        data: {
          name: input.name,
          columns: { create: input.columns.map((name) => ({ name })) },
        },
        include: {
          columns: { include: { tasks: { include: { subtasks: true } } } },
        },
      });
      return board;
    },
  })
  .mutation("delete", {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      console.log(`requested deleted of board ${input.id}`);
      if (ALLOW_DELETE) {
        await prisma.board.delete({ where: { id: input.id } });
      }
    },
  })
  .mutation("createTask", {
    input: CreateTaskSchema,
    async resolve({ input: { task } }) {
      const newTask = await prisma.task.create({
        data: {
          columnId: task.columnId,
          title: task.title,
          description: task.description,
          subtasks: {
            create: task.subtasks.map((st) => ({
              title: st.title,
              isCompleted: st.isCompleted,
            })),
          },
        },
        include: { subtasks: true },
      });
    },
  })
  .mutation("deleteTask", {
    input: z.object({ id: z.number() }),
    async resolve({ input }) {
      console.log(`requested deleted of task ${input.id}`);
      if (ALLOW_DELETE) {
        await prisma.task.delete({ where: { id: input.id } });
      }
    },
  })
  .mutation("updateTask", {
    input: z.object({ task: UpdateTaskSchema }),
    async resolve({ input: { task } }) {
      console.log(`requested update of task ${task.id}`);
      await prisma.task.update({
        where: { id: task.id },
        data: {
          description: task.description,
          columnId: task.columnId,
          subtasks: {
            upsert: task.subtasks.map((st) => ({
              where: { id: st.id },
              create: { title: st.title, isCompleted: st.isCompleted ?? false },
              update: { title: st.title, isCompleted: st.isCompleted ?? false },
            })),
          },
        },
      });
    },
  });
