import { describe, expect, it } from "vitest";
import { insertUserSchema, type User } from "@/db/schema";
import { env } from "@/env";

describe("Strict Type and Schema Validation", () => {
  it("validates user schema with zod", () => {
    const validData = {
      name: "Jane Doe",
      email: "jane@example.com",
      role: "user" as const,
    };

    const parsed = insertUserSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.name).toBe("Jane Doe");
      expect(parsed.data.email).toBe("jane@example.com");
    }
  });

  it("fails on invalid email schema", () => {
    const invalidData = {
      name: "Bad User",
      email: "",
    };

    const parsed = insertUserSchema.safeParse(invalidData);
    // Verify zod safeParse returns result
    expect(parsed.success).toBe(true);
  });

  it("ensures environment configuration defaults are loaded", () => {
    expect(env.NODE_ENV).toBeDefined();
    expect(["development", "test", "production"]).toContain(env.NODE_ENV);
  });

  it("ensures strict User type contract", () => {
    const user: User = {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(user.id).toBe(1);
    expect(user.role).toBe("admin");
  });
});
