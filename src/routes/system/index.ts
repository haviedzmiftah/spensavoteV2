import { Elysia, t } from "elysia";
import { sql } from "drizzle-orm";
import { db } from "../../db";
import { votes, candidates, users } from "../../db/schema";
import { authPlugin } from "../../middlewares/auth";

export const systemRoutes = new Elysia({ prefix: "/system" })
  .use(authPlugin)

  // 1. Endpoint Reset Database Keseluruhan (Khusus Admin)
  .delete(
    "/reset",
    async ({ requireAdmin, set }) => {
      try {
        await requireAdmin();

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

        if (error?.message?.includes("Akses ditolak")) {
          set.status = 403;
          return {
            success: false,
            message: error.message,
          };
        }
        if (error?.message?.includes("Token otentikasi")) {
          set.status = 401;
          return {
            success: false,
            message: error.message,
          };
        }

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
        401: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Tidak terautentikasi",
          }
        ),
        403: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Akses ditolak untuk selain role admin",
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
        summary: "Reset seluruh database (Admin)",
        description: "Mengosongkan semua data dalam tabel votes, candidates, dan users. Memerlukan akses Admin.",
      },
    }
  )

  // 2. Endpoint Reset Seluruh Suara Pemilu (Khusus Admin)
  .delete(
    "/reset-votes",
    async ({ requireAdmin, set }) => {
      try {
        await requireAdmin();

        await db.delete(votes);

        return {
          success: true,
          message: "Seluruh data suara (voting) berhasil dikosongkan",
        };
      } catch (error: any) {
        if (error?.message?.includes("Akses ditolak")) {
          set.status = 403;
          return {
            success: false,
            message: error.message,
          };
        }
        if (error?.message?.includes("Token otentikasi")) {
          set.status = 401;
          return {
            success: false,
            message: error.message,
          };
        }

        set.status = 500;
        return {
          success: false,
          message: "Gagal mengosongkan data voting",
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
            description: "Tabel suara berhasil dikosongkan",
            examples: [
              {
                success: true,
                message: "Seluruh data suara (voting) berhasil dikosongkan",
              },
            ],
          }
        ),
        401: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Tidak terautentikasi",
          }
        ),
        403: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Akses ditolak untuk selain role admin",
          }
        ),
        500: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
            error: t.Optional(t.String()),
          },
          {
            description: "Gagal mengosongkan data voting",
          }
        ),
      },
      detail: {
        tags: ["System"],
        summary: "Reset seluruh suara / votes (Admin)",
        description: "Mengosongkan semua data dari tabel votes untuk memulai ulang pemilu. Data kandidat dan user tetap utuh. Memerlukan akses Admin.",
      },
    }
  );

