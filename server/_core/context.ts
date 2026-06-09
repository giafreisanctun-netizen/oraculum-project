import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { getUserById } from "../_core/auth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: Omit<User, "passwordHash"> | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: Omit<User, "passwordHash"> | null = null;

  try {
    // Check if user is authenticated via session
    const userId = (opts.req.session as any)?.userId;

    if (userId && typeof userId === "number") {
      const dbUser = await getUserById(userId);
      if (dbUser) {
        user = dbUser;
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    console.error("[Context] Error getting user:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
