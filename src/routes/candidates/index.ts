import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { candidates } from "../../db/schema";
import { authPlugin } from "../../middlewares/auth";
import path from "path";
import fs from "fs";

export const candidateRoutes = new Elysia({ prefix: "/candidates" })
  .use(authPlugin)

  // 1. Dapatkan semua data kandidat (Publik)
  .get(
    "/",
    async ({ set }) => {
      try {
        const result = await db.select().from(candidates);
        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        set.status = 500;
        return {
          success: false,
          message: "Gagal mengambil data kandidat",
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
                candidateNumber: t.Number(),
                chairmanName: t.String(),
                viceChairmanName: t.String(),
                vision: t.String(),
                mission: t.String(),
                photoUrl: t.Nullable(t.String()),
              })
            ),
          },
          {
            description: "Daftar seluruh kandidat",
            examples: [
              {
                success: true,
                data: [
                  {
                    id: 1,
                    candidateNumber: 1,
                    chairmanName: "Ahmad Rizky Pratama",
                    viceChairmanName: "Budi Santoso",
                    vision: "Mewujudkan OSIS yang aktif, kreatif, dan berakhlak mulia",
                    mission: "1. Mengadakan event tahunan sekolah; 2. Mendukung program literasi siswa",
                    photoUrl: "https://example.com/paslon1.jpg",
                  },
                ],
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
            description: "Gagal mengambil data kandidat",
          }
        ),
      },
      detail: {
        tags: ["Candidates"],
        summary: "Dapatkan semua kandidat",
        description: "Mengambil daftar seluruh pasangan calon kandidat ketua & wakil ketua.",
      },
    }
  )

  // 2. Upload Foto Paslon (Khusus Admin)
  .post(
    "/upload",
    async ({ body, requireAdmin, set }) => {
      try {
        await requireAdmin();

        const file = body.file;
        if (!file || !(file instanceof Blob || file instanceof File)) {
          set.status = 400;
          return {
            success: false,
            message: "File gambar tidak ditemukan atau format tidak valid",
          };
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
          set.status = 400;
          return {
            success: false,
            message: "Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.",
          };
        }

        const uploadDir = path.join(process.cwd(), "public", "uploads", "candidates");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const ext = file.name ? path.extname(file.name) || ".jpg" : ".jpg";
        const filename = `paslon-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
        const filePath = path.join(uploadDir, filename);

        const arrayBuffer = await file.arrayBuffer();
        await Bun.write(filePath, arrayBuffer);

        const photoUrl = `/uploads/candidates/${filename}`;

        return {
          success: true,
          message: "Foto berhasil diunggah",
          photoUrl: photoUrl,
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
          message: "Gagal mengunggah foto",
          error: error?.message,
        };
      }
    },
    {
      body: t.Object({
        file: t.File({
          description: "File foto paslon (JPG, PNG, WEBP, GIF)",
        }),
      }),
      detail: {
        tags: ["Candidates"],
        summary: "Upload Foto Paslon (Admin)",
        description: "Mengunggah foto kandidat/paslon. Memerlukan token Bearer Admin.",
      },
    }
  )

  // 3. Tambah data kandidat baru (Khusus Admin)
  .post(
    "/",
    async ({ body, requireAdmin, set }) => {
      try {
        await requireAdmin();

        await db.insert(candidates).values({
          candidateNumber: body.candidate_number,
          chairmanName: body.chairman_name,
          viceChairmanName: body.vice_chairman_name,
          vision: body.vision,
          mission: body.mission,
          photoUrl: body.photo_url,
        });

        set.status = 201;
        return {
          success: true,
          message: "Kandidat berhasil ditambahkan",
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
          message: "Gagal menambahkan kandidat",
          error: error?.message,
        };
      }
    },
    {
      body: t.Object(
        {
          candidate_number: t.Numeric({
            description: "Nomor urut paslon",
            examples: [1],
          }),
          chairman_name: t.String({
            description: "Nama calon ketua",
            examples: ["Ahmad Rizky Pratama"],
          }),
          vice_chairman_name: t.String({
            description: "Nama calon wakil ketua",
            examples: ["Budi Santoso"],
          }),
          vision: t.String({
            description: "Visi pasangan calon",
            examples: ["Mewujudkan OSIS yang aktif dan kreatif"],
          }),
          mission: t.String({
            description: "Misi pasangan calon",
            examples: ["1. Meningkatkan literasi siswa; 2. Mengadakan kegiatan kreatif"],
          }),
          photo_url: t.Optional(
            t.String({
              description: "URL foto paslon",
              examples: ["https://example.com/paslon1.jpg"],
            })
          ),
        },
        {
          description: "Payload data kandidat baru",
          examples: [
            {
              candidate_number: 1,
              chairman_name: "Ahmad Rizky Pratama",
              vice_chairman_name: "Budi Santoso",
              vision: "Mewujudkan OSIS yang aktif dan kreatif",
              mission: "1. Meningkatkan literasi siswa; 2. Mengadakan kegiatan kreatif",
              photo_url: "https://example.com/paslon1.jpg",
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
            description: "Kandidat berhasil dibuat",
            examples: [
              {
                success: true,
                message: "Kandidat berhasil ditambahkan",
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
        tags: ["Candidates"],
        summary: "Tambah kandidat baru (Admin)",
        description: "Menambahkan pasangan calon ketua & wakil ketua baru. Memerlukan token Bearer dengan role Admin.",
      },
    }
  )

  // 3. Update Data Kandidat (PUT & PATCH - Khusus Admin)
  .put(
    "/:id",
    async ({ params, body, requireAdmin, set }) => {
      try {
        await requireAdmin();

        const candidateId = Number(params.id);
        const existing = await db
          .select()
          .from(candidates)
          .where(eq(candidates.id, candidateId));

        if (existing.length === 0) {
          set.status = 404;
          return {
            success: false,
            message: "Kandidat tidak ditemukan",
          };
        }

        const updateData: Partial<typeof candidates.$inferInsert> = {};
        if (body.candidate_number !== undefined) updateData.candidateNumber = body.candidate_number;
        if (body.chairman_name !== undefined) updateData.chairmanName = body.chairman_name;
        if (body.vice_chairman_name !== undefined) updateData.viceChairmanName = body.vice_chairman_name;
        if (body.vision !== undefined) updateData.vision = body.vision;
        if (body.mission !== undefined) updateData.mission = body.mission;
        if (body.photo_url !== undefined) updateData.photoUrl = body.photo_url;

        await db
          .update(candidates)
          .set(updateData)
          .where(eq(candidates.id, candidateId));

        return {
          success: true,
          message: "Data kandidat berhasil diperbarui",
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
          message: "Gagal memperbarui data kandidat",
          error: error?.message,
        };
      }
    },
    {
      params: t.Object({
        id: t.Numeric({
          description: "ID Kandidat yang akan diubah",
          examples: [1],
        }),
      }),
      body: t.Object(
        {
          candidate_number: t.Optional(
            t.Numeric({
              description: "Nomor urut paslon baru",
              examples: [1],
            })
          ),
          chairman_name: t.Optional(
            t.String({
              description: "Nama calon ketua baru",
              examples: ["Ahmad Rizky Pratama"],
            })
          ),
          vice_chairman_name: t.Optional(
            t.String({
              description: "Nama calon wakil ketua baru",
              examples: ["Budi Santoso"],
            })
          ),
          vision: t.Optional(
            t.String({
              description: "Visi baru",
              examples: ["Mewujudkan OSIS yang aktif dan berprestasi"],
            })
          ),
          mission: t.Optional(
            t.String({
              description: "Misi baru",
              examples: ["1. Menyelenggarakan kegiatan ekstrakurikuler berprestasi"],
            })
          ),
          photo_url: t.Optional(
            t.String({
              description: "URL foto paslon baru",
              examples: ["https://example.com/paslon1-new.jpg"],
            })
          ),
        },
        {
          description: "Payload update data kandidat",
        }
      ),
      response: {
        200: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Data kandidat berhasil diperbarui",
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
            description: "Kandidat tidak ditemukan",
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
        tags: ["Candidates"],
        summary: "Update data kandidat (PUT - Admin)",
        description: "Memperbarui informasi kandidat berdasarkan ID. Memerlukan token Bearer dengan role Admin.",
      },
    }
  )
  .patch(
    "/:id",
    async ({ params, body, requireAdmin, set }) => {
      try {
        await requireAdmin();

        const candidateId = Number(params.id);
        const existing = await db
          .select()
          .from(candidates)
          .where(eq(candidates.id, candidateId));

        if (existing.length === 0) {
          set.status = 404;
          return {
            success: false,
            message: "Kandidat tidak ditemukan",
          };
        }

        const updateData: Partial<typeof candidates.$inferInsert> = {};
        if (body.candidate_number !== undefined) updateData.candidateNumber = body.candidate_number;
        if (body.chairman_name !== undefined) updateData.chairmanName = body.chairman_name;
        if (body.vice_chairman_name !== undefined) updateData.viceChairmanName = body.vice_chairman_name;
        if (body.vision !== undefined) updateData.vision = body.vision;
        if (body.mission !== undefined) updateData.mission = body.mission;
        if (body.photo_url !== undefined) updateData.photoUrl = body.photo_url;

        await db
          .update(candidates)
          .set(updateData)
          .where(eq(candidates.id, candidateId));

        return {
          success: true,
          message: "Data kandidat berhasil diperbarui",
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
          message: "Gagal memperbarui data kandidat",
          error: error?.message,
        };
      }
    },
    {
      params: t.Object({
        id: t.Numeric({
          description: "ID Kandidat yang akan diubah",
          examples: [1],
        }),
      }),
      body: t.Object(
        {
          candidate_number: t.Optional(
            t.Numeric({
              description: "Nomor urut paslon baru",
              examples: [1],
            })
          ),
          chairman_name: t.Optional(
            t.String({
              description: "Nama calon ketua baru",
              examples: ["Ahmad Rizky Pratama"],
            })
          ),
          vice_chairman_name: t.Optional(
            t.String({
              description: "Nama calon wakil ketua baru",
              examples: ["Budi Santoso"],
            })
          ),
          vision: t.Optional(
            t.String({
              description: "Visi baru",
              examples: ["Mewujudkan OSIS yang aktif dan berprestasi"],
            })
          ),
          mission: t.Optional(
            t.String({
              description: "Misi baru",
              examples: ["1. Menyelenggarakan kegiatan ekstrakurikuler berprestasi"],
            })
          ),
          photo_url: t.Optional(
            t.String({
              description: "URL foto paslon baru",
              examples: ["https://example.com/paslon1-new.jpg"],
            })
          ),
        },
        {
          description: "Payload update data kandidat secara parsial",
        }
      ),
      response: {
        200: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Data kandidat berhasil diperbarui",
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
            description: "Kandidat tidak ditemukan",
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
        tags: ["Candidates"],
        summary: "Update data kandidat (PATCH - Admin)",
        description: "Memperbarui informasi kandidat berdasarkan ID secara parsial. Memerlukan token Bearer dengan role Admin.",
      },
    }
  )

  // 4. Hapus Data Kandidat (Khusus Admin)
  .delete(
    "/:id",
    async ({ params, requireAdmin, set }) => {
      try {
        await requireAdmin();

        const candidateId = Number(params.id);
        const existing = await db
          .select()
          .from(candidates)
          .where(eq(candidates.id, candidateId));

        if (existing.length === 0) {
          set.status = 404;
          return {
            success: false,
            message: "Kandidat tidak ditemukan",
          };
        }

        await db.delete(candidates).where(eq(candidates.id, candidateId));

        return {
          success: true,
          message: "Kandidat berhasil dihapus",
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
          message: "Gagal menghapus kandidat",
          error: error?.message,
        };
      }
    },
    {
      params: t.Object({
        id: t.Numeric({
          description: "ID Kandidat yang akan dihapus",
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
            description: "Kandidat berhasil dihapus",
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
            description: "Kandidat tidak ditemukan",
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
        tags: ["Candidates"],
        summary: "Hapus data kandidat (Admin)",
        description: "Menghapus data pasangan calon kandidat berdasarkan ID. Memerlukan token Bearer dengan role Admin.",
      },
    }
  );



