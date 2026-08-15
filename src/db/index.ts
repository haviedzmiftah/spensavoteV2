import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import "dotenv/config";

const connectionUri =
  process.env.DATABASE_URL ||
  `mysql://${process.env.DB_USER || "root"}:${process.env.DB_PASSWORD || ""}@${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || "spensavote_v2"}`;

// Create connection pool
export const poolConnection = mysql.createPool(connectionUri);

// Create Drizzle ORM client
export const db = drizzle(poolConnection, {
  schema,
  mode: "default",
});
