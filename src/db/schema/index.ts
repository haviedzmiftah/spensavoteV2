import { mysqlTable, int, varchar, text, timestamp } from "drizzle-orm/mysql-core";

// 1. Tabel users
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("voters").notNull(), // 'admin' | 'voters'
});

// 2. Tabel candidates
export const candidates = mysqlTable("candidates", {
  id: int("id").primaryKey().autoincrement(),
  candidateNumber: int("candidate_number").notNull().unique(),
  chairmanName: varchar("chairman_name", { length: 255 }).notNull(),
  viceChairmanName: varchar("vice_chairman_name", { length: 255 }).notNull(),
  vision: text("vision").notNull(),
  mission: text("mission").notNull(),
  photoUrl: varchar("photo_url", { length: 500 }),
});

// 3. Tabel votes
export const votes = mysqlTable("votes", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  candidateId: int("candidate_id")
    .notNull()
    .references(() => candidates.id, { onDelete: "cascade" }),
  voteDate: timestamp("vote_date").defaultNow().notNull(),
});
