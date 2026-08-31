import { Elysia, t } from "elysia";
import { eq, and, ne } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import { authPlugin } from "../../middlewares/auth";

export const userRoutes = new Elysia({ prefix: "/users" })
  .use(authPlugin)

  // 1. Dapatkan semua data pemilih / users (Khusus Admin)
  .get(
    "/",
    async ({ requireAdmin, set }) => {
      try {
        await requireAdmin();

        const userList = await db
          .select({
            id: users.id,
            username: users.username,
            role: users.role,
          })
          .from(users);

        return {
          success: true,
          data: userList,
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
          message: "Gagal mengambil data user",
          error: error?.message,
        };
      }
    },
    {
      response: {
        200: t.Object(
          {
            success: t.Boolean(),
            data: t.Array(
              t.Object({
                id: t.Number(),
                username: t.String(),
                role: t.String(),
              })
            ),
          },
          {
            description: "Daftar seluruh user pemilih dan admin",
            examples: [
              {
                success: true,
                data: [
                  {
                    id: 1,
                    username: "admin_sekolah",
                    role: "admin",
                  },
                  {
                    id: 2,
                    username: "siswa_10a_01",
                    role: "voters",
                  },
                ],
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
            description: "Terjadi kesalahan pada server",
          }
        ),
      },
      detail: {
        tags: ["Users"],
        summary: "Lihat semua data pemilih / users (Admin)",
        description: "Mendapatkan daftar seluruh user (pemilih & admin) tanpa mengekspos field password. Memerlukan akses Admin.",
      },
    }
  )

  // 2. Import Data Pemilih Secara Masal / Batch (Khusus Admin)
  .post(
    "/batch",
    async ({ body, requireAdmin, set }) => {
      try {
        await requireAdmin();

        const voterList = body.voters;
        if (!Array.isArray(voterList) || voterList.length === 0) {
          set.status = 400;
          return {
            success: false,
            message: "Daftar pemilih tidak boleh kosong",
          };
        }

        // Ambil semua username yang sudah ada untuk cek duplikasi
        const existingUsers = await db.select({ username: users.username }).from(users);
        const existingUsernameSet = new Set(existingUsers.map((u) => u.username.toLowerCase()));

        const toInsert: Array<{ username: string; password: string; role: "admin" | "voters" }> = [];
        const duplicates: string[] = [];
        const seenInBatch = new Set<string>();

        for (const item of voterList) {
          const username = String(item.username || "").trim();
          const rawPassword = String(item.password || "").trim();
          const role = item.role === "admin" ? "admin" : "voters";

          if (!username || !rawPassword) {
            continue;
          }

          const lowerUser = username.toLowerCase();
          if (existingUsernameSet.has(lowerUser) || seenInBatch.has(lowerUser)) {
            duplicates.push(username);
            continue;
          }

          seenInBatch.add(lowerUser);
          const hashedPassword = await Bun.password.hash(rawPassword, {
            algorithm: "bcrypt",
            cost: 10,
          });

          toInsert.push({
            username,
            password: hashedPassword,
            role,
          });
        }

        if (toInsert.length > 0) {
          // Batch insert ke MySQL
          await db.insert(users).values(toInsert);
        }

        set.status = 201;
        return {
          success: true,
          message: `Berhasil mengimpor ${toInsert.length} data pemilih.${
            duplicates.length > 0 ? ` (${duplicates.length} dilewati karena username duplikat)` : ""
          }`,
          insertedCount: toInsert.length,
          skippedCount: duplicates.length,
          skippedUsernames: duplicates,
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
          message: "Gagal memproses impor data pemilih masal",
          error: error?.message,
        };
      }
    },
    {
      body: t.Object({
        voters: t.Array(
          t.Object({
            username: t.String({ description: "Username / NIS pemilih" }),
            password: t.String({ description: "Password pemilih" }),
            role: t.Optional(t.Union([t.Literal("admin"), t.Literal("voters")])),
          })
        ),
      }),
      detail: {
        tags: ["Users"],
        summary: "Import data pemilih secara masal (Admin)",
        description: "Menambahkan banyak akun pemilih sekaligus dari array data / CSV.",
      },
    }
  )

  // 3. Tambah data pemilih / user baru secara manual (Khusus Admin)
  .post(
    "/",
    async ({ body, requireAdmin, set }) => {
      try {
        await requireAdmin();

        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.username, body.username));

        if (existingUser.length > 0) {
          set.status = 400;
          return {
            success: false,
            message: "Username sudah terdaftar",
          };
        }

        const hashedPassword = await Bun.password.hash(body.password, {
          algorithm: "bcrypt",
          cost: 10,
        });

        await db.insert(users).values({
          username: body.username,
          password: hashedPassword,
          role: body.role || "voters",
        });

        set.status = 201;
        return {
          success: true,
          message: "Data pemilih berhasil ditambahkan",
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
          message: "Gagal menambahkan user pemilih",
          error: error?.message,
        };
      }
    },
    {
      body: t.Object(
        {
          username: t.String({
            description: "Username unik untuk akun pemilih/admin",
            examples: ["siswa_10a_02"],
          }),
          password: t.String({
            description: "Password akun",
            examples: ["password123"],
          }),
          role: t.Optional(
            t.Union([t.Literal("admin"), t.Literal("voters")], {
              description: "Peran akun dalam sistem",
              default: "voters",
              examples: ["voters"],
            })
          ),
        },
        {
          description: "Payload pembuatan pemilih baru",
          examples: [
            {
              username: "siswa_10a_02",
              password: "password123",
              role: "voters",
            },
          ],
        }
      ),
      response: {
        201: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Pemilih berhasil ditambahkan",
          }
        ),
        400: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Username duplikat / data tidak valid",
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
            description: "Terjadi kesalahan pada server",
          }
        ),
      },
      detail: {
        tags: ["Users"],
        summary: "Tambah data pemilih baru (Admin)",
        description: "Menambahkan data pemilih baru secara manual oleh admin. Memerlukan akses Admin.",
      },
    }
  )

  // 3. Update Data Pemilih (PUT - Khusus Admin)
  .put(
    "/:id",
    async ({ params, body, requireAdmin, set }) => {
      try {
        await requireAdmin();

        const userId = Number(params.id);
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.id, userId));

        if (existingUser.length === 0) {
          set.status = 404;
          return {
            success: false,
            message: "Data pemilih tidak ditemukan",
          };
        }

        if (body.username) {
          const duplicate = await db
            .select()
            .from(users)
            .where(and(eq(users.username, body.username), ne(users.id, userId)));

          if (duplicate.length > 0) {
            set.status = 400;
            return {
              success: false,
              message: "Username sudah digunakan oleh akun lain",
            };
          }
        }

        const updateData: Partial<typeof users.$inferInsert> = {};
        if (body.username !== undefined) updateData.username = body.username;
        if (body.role !== undefined) updateData.role = body.role;
        if (body.password) {
          updateData.password = await Bun.password.hash(body.password, {
            algorithm: "bcrypt",
            cost: 10,
          });
        }

        await db.update(users).set(updateData).where(eq(users.id, userId));

        return {
          success: true,
          message: "Data pemilih berhasil diperbarui",
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
          message: "Gagal memperbarui data pemilih",
          error: error?.message,
        };
      }
    },
    {
      params: t.Object({
        id: t.Numeric({
          description: "ID User yang akan diupdate",
          examples: [1],
        }),
      }),
      body: t.Object(
        {
          username: t.Optional(
            t.String({
              description: "Username baru",
              examples: ["siswa_10a_02_new"],
            })
          ),
          password: t.Optional(
            t.String({
              description: "Password baru (jika ingin mereset password)",
              examples: ["newPassword456"],
            })
          ),
          role: t.Optional(
            t.Union([t.Literal("admin"), t.Literal("voters")], {
              description: "Role akun",
              examples: ["voters"],
            })
          ),
        },
        {
          description: "Payload update data pemilih",
        }
      ),
      response: {
        200: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Data pemilih berhasil diperbarui",
          }
        ),
        400: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Username duplikat / data tidak valid",
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
        404: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Data pemilih tidak ditemukan",
          }
        ),
        500: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
            error: t.Optional(t.String()),
          },
          {
            description: "Terjadi kesalahan pada server",
          }
        ),
      },
      detail: {
        tags: ["Users"],
        summary: "Update data pemilih (PUT - Admin)",
        description: "Memperbarui data pemilih atau mereset password berdasarkan ID. Memerlukan akses Admin.",
      },
    }
  )

  // 4. Update Data Pemilih Parsial (PATCH - Khusus Admin)
  .patch(
    "/:id",
    async ({ params, body, requireAdmin, set }) => {
      try {
        await requireAdmin();

        const userId = Number(params.id);
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.id, userId));

        if (existingUser.length === 0) {
          set.status = 404;
          return {
            success: false,
            message: "Data pemilih tidak ditemukan",
          };
        }

        if (body.username) {
          const duplicate = await db
            .select()
            .from(users)
            .where(and(eq(users.username, body.username), ne(users.id, userId)));

          if (duplicate.length > 0) {
            set.status = 400;
            return {
              success: false,
              message: "Username sudah digunakan oleh akun lain",
            };
          }
        }

        const updateData: Partial<typeof users.$inferInsert> = {};
        if (body.username !== undefined) updateData.username = body.username;
        if (body.role !== undefined) updateData.role = body.role;
        if (body.password) {
          updateData.password = await Bun.password.hash(body.password, {
            algorithm: "bcrypt",
            cost: 10,
          });
        }

        await db.update(users).set(updateData).where(eq(users.id, userId));

        return {
          success: true,
          message: "Data pemilih berhasil diperbarui",
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
          message: "Gagal memperbarui data pemilih",
          error: error?.message,
        };
      }
    },
    {
      params: t.Object({
        id: t.Numeric({
          description: "ID User yang akan diupdate",
          examples: [1],
        }),
      }),
      body: t.Object(
        {
          username: t.Optional(
            t.String({
              description: "Username baru",
              examples: ["siswa_10a_02_new"],
            })
          ),
          password: t.Optional(
            t.String({
              description: "Password baru (jika ingin mereset password)",
              examples: ["newPassword456"],
            })
          ),
          role: t.Optional(
            t.Union([t.Literal("admin"), t.Literal("voters")], {
              description: "Role akun",
              examples: ["voters"],
            })
          ),
        },
        {
          description: "Payload update data pemilih secara parsial",
        }
      ),
      response: {
        200: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Data pemilih berhasil diperbarui",
          }
        ),
        400: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Username duplikat / data tidak valid",
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
        404: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Data pemilih tidak ditemukan",
          }
        ),
        500: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
            error: t.Optional(t.String()),
          },
          {
            description: "Terjadi kesalahan pada server",
          }
        ),
      },
      detail: {
        tags: ["Users"],
        summary: "Update data pemilih (PATCH - Admin)",
        description: "Memperbarui data pemilih atau mereset password berdasarkan ID secara parsial. Memerlukan akses Admin.",
      },
    }
  )

  // 5. Hapus Data Pemilih (Khusus Admin)
  .delete(
    "/:id",
    async ({ params, requireAdmin, set }) => {
      try {
        await requireAdmin();

        const userId = Number(params.id);
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.id, userId));

        if (existingUser.length === 0) {
          set.status = 404;
          return {
            success: false,
            message: "Data pemilih tidak ditemukan",
          };
        }

        await db.delete(users).where(eq(users.id, userId));

        return {
          success: true,
          message: "Data pemilih berhasil dihapus",
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
          message: "Gagal menghapus data pemilih",
          error: error?.message,
        };
      }
    },
    {
      params: t.Object({
        id: t.Numeric({
          description: "ID User yang akan dihapus",
          examples: [1],
        }),
      }),
      response: {
        200: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Data pemilih berhasil dihapus",
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
        404: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Data pemilih tidak ditemukan",
          }
        ),
        500: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
            error: t.Optional(t.String()),
          },
          {
            description: "Terjadi kesalahan pada server",
          }
        ),
      },
      detail: {
        tags: ["Users"],
        summary: "Hapus data pemilih (Admin)",
        description: "Menghapus data pemilih berdasarkan ID. Memerlukan akses Admin.",
      },
    }
  );
