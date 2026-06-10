/**
 * Session Configuration Module
 * Configures express-session with secure HTTP-only cookies
 */

import session from "express-session";
import { ENV } from "./env";

/**
 * Get session configuration
 * Uses secure HTTP-only cookies with SameSite protection
 */
export function getSessionConfig(): session.SessionOptions {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    secret: ENV.jwtSecret || "oraculum-dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction, // HTTPS only in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    },
    name: "app_session_id", // Custom session cookie name
  };
}
