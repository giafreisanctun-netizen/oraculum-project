/**
 * Local Authentication Routes
 * Handles login and logout with session management
 */

import { Express, Request, Response } from "express";
import { authenticateUser } from "../_core/auth";

export function registerLoginRoutes(app: Express) {
  /**
   * POST /api/auth/login
   * Authenticate user with username and password
   */
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          error: "Username and password are required",
        });
      }

      // Authenticate user
      const user = await authenticateUser(username, password);

      if (!user) {
        return res.status(401).json({
          error: "Invalid username or password",
        });
      }

      // Store user in session
      (req.session as any).userId = user.id;
      (req.session as any).username = user.username;
      (req.session as any).role = user.role;

      // Save session
      req.session.save((err) => {
        if (err) {
          console.error("[Auth] Session save error:", err);
          return res.status(500).json({
            error: "Session error",
          });
        }

        // Return user (already doesn't have passwordHash from auth module)
        return res.status(200).json({
          success: true,
          user,
        });
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
   * Clear session
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
   * Get current user from session
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
