/**
 * Local Authentication Routes
 * Handles login and logout with session management
 */

import { Express, Request, Response } from "express";
import { authenticateUser } from "../_core/auth";

export function registerLoginRoutes(app: Express) {
  /**
   * POST /api/auth/login
   */
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: "Username and password are required",
        });
      }

      const user = await authenticateUser(username, password);

      if (!user) {
        return res.status(401).json({
          error: "Invalid username or password",
        });
      }

      // salva sessão
      (req.session as any).userId = user.id;
      (req.session as any).username = user.username;
      (req.session as any).role = user.role;

      // garante que a sessão foi salva antes de responder
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("[Auth] Login error:", error);

      return res.status(500).json({
        error: "Internal server error",
      });
    }
  });

  /**
   * POST /api/auth/logout
   */
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("[Auth] Session destroy error:", err);
        return res.status(500).json({
          error: "Logout error",
        });
      }

      res.clearCookie("app_session_id");

      return res.status(200).json({
        success: true,
      });
    });
  });

  /**
   * GET /api/auth/me
   */
  app.get("/api/auth/me", (req: Request, res: Response) => {
    const userId = (req.session as any)?.userId;

    if (!userId) {
      return res.status(401).json({
        user: null,
      });
    }

    return res.status(200).json({
      user: {
        id: (req.session as any)?.userId,
        username: (req.session as any)?.username,
        role: (req.session as any)?.role,
      },
    });
  });
}
