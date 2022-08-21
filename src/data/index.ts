import { readFileSync } from "fs";
import path from "path";
import { z } from "zod";
import { Board } from "@kanban/domain";
import rawData from "./data.json";

export function getDataSync(): Map<number, Board> {
  const { boards } = BoardDataSchema.parse(rawData);
  return new Map(boards.map((b) => [b.id, b]));
}

const TaskSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  description: z.string(),
  status: z.string(),
  subtasks: z
    .object({ title: z.string().min(1), isCompleted: z.boolean() })
    .array(),
});

const ColumnSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  tasks: z.array(TaskSchema),
});
const BoardSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  columns: z.array(ColumnSchema),
});

const BoardDataSchema = z.object({ boards: BoardSchema.array() });
