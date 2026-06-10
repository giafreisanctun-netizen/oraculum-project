import "express-session";

declare global {
  namespace Express {
    interface Request {
      session: Express.Session & {
        userId?: number;
        username?: string;
        role?: "user" | "admin";
      };
    }
  }
}
