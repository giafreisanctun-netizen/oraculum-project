import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  posts: router({
    getAll: publicProcedure.query(() => getAllPosts()),
    
    getById: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "number") return val;
        throw new Error("Invalid input");
      })
      .query(({ input }) => getPostById(input)),
    
    create: protectedProcedure
      .input((val: unknown) => {
        if (
          typeof val === "object" &&
          val !== null &&
          "content" in val &&
          "dateOriginal" in val
        ) {
          return val as { content: string; dateOriginal: string };
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return createPost({
          content: input.content,
          dateOriginal: input.dateOriginal,
        });
      }),
    
    update: protectedProcedure
      .input((val: unknown) => {
        if (
          typeof val === "object" &&
          val !== null &&
          "id" in val
        ) {
          return val as { id: number; content?: string; dateOriginal?: string };
        }
        throw new Error("Invalid input");
      })
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return updatePost(input.id, {
          content: input.content,
          dateOriginal: input.dateOriginal,
        });
      }),
    
    delete: protectedProcedure
      .input((val: unknown) => {
        if (typeof val === "number") return val;
        throw new Error("Invalid input");
      })
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return deletePost(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
