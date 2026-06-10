/**
 * Local Authentication Module
 * Handles user login/logout with bcrypt password hashing and session management
 */

import bcryptjs from "bcryptjs";
import { eq } from "drizzle-orm";
import { users } from "../../drizzle/schema";
import { getDb } from "../db";

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

/**
 * Compare password with hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Authenticate user safely
 */
export async function authenticateUser(username: string, password: string) {
  try {
    const db = await getDb();

    if (!db) {
      console.error("[Auth] Database not available");
      return null;
    }

    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    const user = result?.[0];

    if (!user) {
      return null;
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return null;
    }

    await db
      .update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, user.id));

    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  } catch (error) {
    console.error("[Auth] authenticateUser error:", error);
    return null;
  }
}

/**
 * Get user by ID safely
 */
export async function getUserById(id: number) {
  try {
    const db = await getDb();

    if (!db) {
      console.error("[Auth] Database not available");
      return null;
    }

    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    const user = result?.[0];

    if (!user) {
      return null;
    }

    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  } catch (error) {
    console.error("[Auth] getUserById error:", error);
    return null;
  }
}

/**
 * Change password safely
 */
export async function changePassword(
  userId: number,
  newPassword: string
): Promise<boolean> {
  try {
    const db = await getDb();

    if (!db) {
      console.error("[Auth] Database not available");
      return false;
    }

    const hashedPassword = await hashPassword(newPassword);

    await db
      .update(users)
      .set({ passwordHash: hashedPassword })
      .where(eq(users.id, userId));

    return true;
  } catch (error) {
    console.error("[Auth] changePassword error:", error);
    return false;
  }
} * @param password Plain text password
 * @returns User object if authentication succeeds, null otherwise
 */
export async function authenticateUser(username: string, password: string) {
  const db = await getDb();
  if (!db) {
    console.error("[Auth] Database not available");
    return null;
  }

  try {
    // Find user by username
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    const user = result.length > 0 ? result[0] : null;

    if (!user) {
      return null; // User not found
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return null; // Password incorrect
    }

    // Update lastSignedIn
    await db
      .update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, user.id));

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("[Auth] Authentication error:", error);
    return null;
  }
}

/**
 * Get user by ID
 * @param id User ID
 * @returns User object or null
 */
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.error("[Auth] Database not available");
    return null;
  }

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    const user = result.length > 0 ? result[0] : null;

    if (!user) {
      return null;
    }

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("[Auth] Get user error:", error);
    return null;
  }
}

/**
 * Change user password
 * @param userId User ID
 * @param newPassword New plain text password
 * @returns True if successful
 */
export async function changePassword(
  userId: number,
  newPassword: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    console.error("[Auth] Database not available");
    return false;
  }

  try {
    const hashedPassword = await hashPassword(newPassword);

    await db
      .update(users)
      .set({ passwordHash: hashedPassword })
      .where(eq(users.id, userId));

    return true;
  } catch (error) {
    console.error("[Auth] Change password error:", error);
    return false;
  }
}
