// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { boardsRouter } from "./boards";
import { authRouter } from "./auth";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("boards.", boardsRouter)
  .merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
