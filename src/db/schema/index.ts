import { mysqlTable, serial, varchar, timestamp, int, text } from "drizzle-orm/mysql-core";

// Tabel Pengguna / Pemilih
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nis: varchar("nis", { length: 50 }).notNull().unique(),
  role: varchar("role", { length: 50 }).default("voter").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Tabel Kandidat
export const candidates = mysqlTable("candidates", {
  id: serial("id").primaryKey(),
  candidateNumber: int("candidate_number").notNull().unique(),
  chairmanName: varchar("chairman_name", { length: 255 }).notNull(),
  viceChairmanName: varchar("vice_chairman_name", { length: 255 }).notNull(),
  vision: text("vision").notNull(),
  mission: text("mission").notNull(),
  photoUrl: varchar("photo_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabel Voting / Suara
export const votes = mysqlTable("votes", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull().unique(),
  candidateId: int("candidate_id").notNull(),
  votedAt: timestamp("voted_at").defaultNow().notNull(),
});
