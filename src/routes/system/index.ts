import { Elysia } from "elysia";
import { sql } from "drizzle-orm";
import { db } from "../../db";
import { votes, candidates, users } from "../../db/schema";

export const systemRoutes = new Elysia({ prefix: "/system" })
  // 1. Endpoint Reset Database
  .delete(
    "/reset",
    async ({ set }) => {
      try {
        // Matikan foreign key check sementara agar truncate/delete bersih
        await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0;`);
        
        // Hapus data tabel sesuai urutan relasi
        await db.delete(votes);
        await db.delete(candidates);
        await db.delete(users);

        // Hidupkan kembali foreign key check
        await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`);

        return {
          success: true,
          message: "Database berhasil di-reset (semua data telah dikosongkan)",
        };
      } catch (error: any) {
        // Pastikan FK checks dihidupkan jika error
        await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`);
        set.status = 500;
        return {
          success: false,
          message: "Gagal me-reset database",
          error: error?.message,
        };
      }
    },
    {
      detail: {
        tags: ["System"],
        summary: "Reset dan kosongkan semua data database",
      },
    }
  );
