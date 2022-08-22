import { z } from "zod";

export const TaskSchema = z.object({
  id: z.number(),
  columnId: z.number(),
  title: z.string().min(1),
  description: z.string(),
  subtasks: z
    .object({
      id: z.number(),
      title: z.string().min(1),
      isCompleted: z.boolean(),
    })
    .array(),
});

export const ColumnSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  tasks: z.array(TaskSchema),
});
export const BoardSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  columns: z.array(ColumnSchema),
});

export const BoardDataSchema = z.object({ boards: BoardSchema.array() });
