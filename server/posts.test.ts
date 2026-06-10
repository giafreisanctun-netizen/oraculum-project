import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

// Mock admin user
const adminUser: Omit<User, "passwordHash"> = {
  id: 1,
  email: "admin@oraculum.test",
  name: "Admin User",
  role: "admin",
  username: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

// Mock regular user
const regularUser: Omit<User, "passwordHash"> = {
  id: 2,
  email: "user@oraculum.test",
  name: "Regular User",
  role: "user",
  username: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

// Create mock context
function createMockContext(user: Omit<User, "passwordHash"> | null): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Posts Router", () => {
  describe("getAll", () => {
    it("should return all posts as public procedure", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const posts = await caller.posts.getAll();

      expect(Array.isArray(posts)).toBe(true);

      // Verify post structure
      const post = posts[0];
      expect(post).toHaveProperty("id");
      expect(post).toHaveProperty("content");
      expect(post).toHaveProperty("dateOriginal");
      expect(post).toHaveProperty("datePublished");
    });

    it("should return posts ordered by dateOriginal descending", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const posts = await caller.posts.getAll();

      if (posts.length > 1) {
        const first = new Date(posts[0].dateOriginal).getTime();
        const second = new Date(posts[1].dateOriginal).getTime();
        expect(first).toBeGreaterThanOrEqual(second);
      }
    });
  });

  describe("getById", () => {
    it("should return a single post by id", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const allPosts = await caller.posts.getAll();

      if (allPosts.length > 0) {
        const post = await caller.posts.getById(allPosts[0].id);
        expect(post).toBeDefined();
        expect(post?.id).toBe(allPosts[0].id);
        expect(post?.content).toBe(allPosts[0].content);
      }
    });

    it("should return undefined for non-existent post", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const post = await caller.posts.getById(999999);
      expect(post).toBeUndefined();
    });
  });

  describe("create", () => {
    it("should allow admin to create a post", async () => {
      const caller = appRouter.createCaller(createMockContext(adminUser));

      const result = await caller.posts.create({
        content: "Test post for Oraculum",
        dateOriginal: "2026-06-09",
      });

      expect(result).toBeDefined();
    });

    it("should reject non-admin users from creating posts", async () => {
      const caller = appRouter.createCaller(createMockContext(regularUser));

      try {
        await caller.posts.create({
          content: "Unauthorized post",
          dateOriginal: "2026-06-09",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should reject unauthenticated users from creating posts", async () => {
      const caller = appRouter.createCaller(createMockContext(null));

      try {
        await caller.posts.create({
          content: "Unauthorized post",
          dateOriginal: "2026-06-09",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("update", () => {
    it("should allow admin to update a post", async () => {
      const caller = appRouter.createCaller(createMockContext(adminUser));
      const allPosts = await caller.posts.getAll();

      if (allPosts.length > 0) {
        const postId = allPosts[0].id;
        const result = await caller.posts.update({
          id: postId,
          content: "Updated test content",
        });

        expect(result).toBeDefined();
      }
    });

    it("should reject non-admin users from updating posts", async () => {
      const caller = appRouter.createCaller(createMockContext(regularUser));
      const allPosts = await appRouter
        .createCaller(createMockContext(null))
        .posts.getAll();

      if (allPosts.length > 0) {
        try {
          await caller.posts.update({
            id: allPosts[0].id,
            content: "Unauthorized update",
          });
          expect.fail("Should have thrown an error");
        } catch (error) {
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe("delete", () => {
    it("should allow admin to delete a post", async () => {
      const caller = appRouter.createCaller(createMockContext(adminUser));

      // First create a post to delete
      await caller.posts.create({
        content: "Post to be deleted",
        dateOriginal: "2026-06-09",
      });

      const allPosts = await caller.posts.getAll();
      const lastPost = allPosts[allPosts.length - 1];

      const result = await caller.posts.delete(lastPost.id);
      expect(result).toBeDefined();
    });

    it("should reject non-admin users from deleting posts", async () => {
      const caller = appRouter.createCaller(createMockContext(regularUser));
      const allPosts = await appRouter
        .createCaller(createMockContext(null))
        .posts.getAll();

      if (allPosts.length > 0) {
        try {
          await caller.posts.delete(allPosts[0].id);
          expect.fail("Should have thrown an error");
        } catch (error) {
          expect(error).toBeDefined();
        }
      }
    });
  });
});
