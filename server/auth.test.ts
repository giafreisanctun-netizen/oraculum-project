import { describe, expect, it, beforeAll } from "vitest";
import { hashPassword, verifyPassword, authenticateUser } from "./_core/auth";

describe("Local Authentication", () => {
  describe("Password Hashing", () => {
    it("should hash a password", async () => {
      const password = "test_password_123";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20); // bcrypt hashes are long
    });

    it("should verify a correct password", async () => {
      const password = "test_password_123";
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it("should reject an incorrect password", async () => {
      const password = "test_password_123";
      const wrongPassword = "wrong_password";
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(wrongPassword, hash);

      expect(isValid).toBe(false);
    });

    it("should generate different hashes for the same password", async () => {
      const password = "test_password_123";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
      // But both should verify correctly
      expect(await verifyPassword(password, hash1)).toBe(true);
      expect(await verifyPassword(password, hash2)).toBe(true);
    });
  });

  describe("User Authentication", () => {
    it("should authenticate user with correct credentials", async () => {
      // Note: This test assumes the admin user exists in the database
      // from the migration with default password
      const user = await authenticateUser(
        "admin",
        "alterar_apos_primeiro_login"
      );

      if (user) {
        expect(user.username).toBe("admin");
        expect(user.role).toBe("admin");
        expect((user as any).passwordHash).toBeUndefined();
      }
    });

    it("should return null for non-existent user", async () => {
      const user = await authenticateUser(
        "nonexistent_user_xyz",
        "any_password"
      );

      expect(user).toBeNull();
    });

    it("should return null for incorrect password", async () => {
      // Assuming admin user exists
      const user = await authenticateUser("admin", "wrong_password");

      expect(user).toBeNull();
    });

    it("should not return password hash in authenticated user", async () => {
      const user = await authenticateUser(
        "admin",
        "alterar_apos_primeiro_login"
      );

      if (user) {
        expect((user as any).passwordHash).toBeUndefined();
      }
    });
  });
});
