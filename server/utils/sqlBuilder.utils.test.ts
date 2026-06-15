import { buildOrderConditions, buildOrderByClause } from "./sqlBuilder.utils";
import { eq, gte, lte, asc, desc, sql } from "drizzle-orm";

// 1. MOCK THE DATABASE SCHEMA
// We don't want to load real database tables, so we just create fake column names
jest.mock("../db/schema", () => ({
  orders: {
    userId: "mock_userId_col",
    status: "mock_status_col",
    createdAt: "mock_createdAt_col",
  },
}));

// 2. MOCK DRIZZLE ORM
// Instead of creating real SQL, we force Drizzle to just return simple objects
// so we can easily read them in our assertions.
jest.mock("drizzle-orm", () => ({
  eq: jest.fn((col, val) => ({ operator: "eq", col, val })),
  gte: jest.fn((col, val) => ({ operator: "gte", col, val })),
  lte: jest.fn((col, val) => ({ operator: "lte", col, val })),
  asc: jest.fn((col) => ({ operator: "asc", col })),
  desc: jest.fn((col) => ({ operator: "desc", col })),
  // Mocking the sql`...` tagged template literal
  sql: jest.fn(() => ({ operator: "sql", query: "CASE WHEN status..." })),
}));

describe("SQL Builder Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("buildOrderConditions()", () => {
    it("should return an empty array if no options are provided", () => {
      const conditions = buildOrderConditions({});
      expect(conditions).toEqual([]);
    });

    it("should add an 'eq' condition for userId", () => {
      const conditions = buildOrderConditions({ userId: "user-123" });
      
      expect(conditions.length).toBe(1);
      expect(eq).toHaveBeenCalledWith("mock_userId_col", "user-123");
      expect(conditions[0]).toEqual({ operator: "eq", col: "mock_userId_col", val: "user-123" });
    });

    it("should add an 'eq' condition for status unless it is 'all' or excluded", () => {
      // Test valid status
      const validConditions = buildOrderConditions({ status: "pending" });
      expect(validConditions[0]).toEqual({ operator: "eq", col: "mock_status_col", val: "pending" });

      // Test 'all' status (should be ignored)
      const allConditions = buildOrderConditions({ status: "all" });
      expect(allConditions).toEqual([]);

      // Test excludeStatus flag
      const excludedConditions = buildOrderConditions({ status: "pending" }, true);
      expect(excludedConditions).toEqual([]);
    });

    it("should add 'gte' and 'lte' conditions for dates", () => {
      const conditions = buildOrderConditions({
        dateFrom: "2024-01-01",
        dateTo: "2024-12-31",
      });

      expect(conditions.length).toBe(2);
      
      // Check dateFrom (gte)
      expect(gte).toHaveBeenCalled();
      expect((conditions[0]! as any).operator).toBe("gte");
      expect((conditions[0]! as any).col).toBe("mock_createdAt_col");
      
      // Check dateTo (lte) - Verify your "T23:59:59.999Z" logic worked
      expect(lte).toHaveBeenCalled();
      expect((conditions[1]! as any).operator).toBe("lte");
      expect((conditions[1]! as any).val.toISOString()).toBe("2024-12-31T23:59:59.999Z");
    });
  });

  describe("buildOrderByClause()", () => {
    it("should default to sorting by createdAt descending", () => {
      const result = buildOrderByClause();
      expect(desc).toHaveBeenCalledWith("mock_createdAt_col");
      expect(result).toEqual({ operator: "desc", col: "mock_createdAt_col" });
    });

    it("should sort by date ascending when requested", () => {
      const result = buildOrderByClause("date", "asc");
      expect(asc).toHaveBeenCalledWith("mock_createdAt_col");
      expect(result).toEqual({ operator: "asc", col: "mock_createdAt_col" });
    });

    it("should sort by custom SQL status logic when requested", () => {
      const result = buildOrderByClause("status", "asc");
      
      // Prove that your sql`CASE...` statement was triggered
      expect(sql).toHaveBeenCalled();
      expect(asc).toHaveBeenCalledWith({ operator: "sql", query: "CASE WHEN status..." });
      expect((result! as any).operator).toBe("asc");
    });
  });
});