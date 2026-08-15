import { Elysia, t } from "elysia";
import { sql } from "drizzle-orm";
import { db } from "../../db";
import { votes, candidates, users } from "../../db/schema";
import { authPlugin } from "../../middlewares/auth";

export const systemRoutes = new Elysia({ prefix: "/system" })
  .use(authPlugin)

  // 1. Endpoint Reset Database
  .delete(
    "/reset",
    async ({ set }) => {
      try {
        await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0;`);
        await db.delete(votes);
        await db.delete(candidates);
        await db.delete(users);
        await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`);

        return {
          success: true,
          message: "Database berhasil di-reset (semua data telah dikosongkan)",
        };
      } catch (error: any) {
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
      response: {
        200: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Database berhasil dikosongkan",
            examples: [
              {
                success: true,
                message: "Database berhasil di-reset (semua data telah dikosongkan)",
              },
            ],
          }
        ),
        500: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
            error: t.Optional(t.String()),
          },
          {
            description: "Gagal me-reset database",
            examples: [
              {
                success: false,
                message: "Gagal me-reset database",
                error: "Database error description",
              },
            ],
          }
        ),
      },
      detail: {
        tags: ["System"],
        summary: "Reset seluruh database",
        description: "Mengosongkan semua data dalam tabel votes, candidates, dan users.",
      },
    }
  );
