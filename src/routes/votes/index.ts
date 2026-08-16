import { Elysia, t } from "elysia";
import { eq, sql } from "drizzle-orm";
import { db } from "../../db";
import { votes, candidates, users } from "../../db/schema";
import { authPlugin } from "../../middlewares/auth";

export const voteRoutes = new Elysia({ prefix: "/votes" })
  .use(authPlugin)

  // 1. Endpoint Vote (Hanya bisa vote sekali)
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const userExists = await db
          .select()
          .from(users)
          .where(eq(users.id, body.user_id));

        if (userExists.length === 0) {
          set.status = 404;
          return {
            success: false,
            message: "User tidak ditemukan",
          };
        }

        const candidateExists = await db
          .select()
          .from(candidates)
          .where(eq(candidates.id, body.candidate_id));

        if (candidateExists.length === 0) {
          set.status = 404;
          return {
            success: false,
            message: "Kandidat tidak ditemukan",
          };
        }

        const existingVote = await db
          .select()
          .from(votes)
          .where(eq(votes.userId, body.user_id));

        if (existingVote.length > 0) {
          set.status = 400;
          return {
            success: false,
            message: "Voter hanya bisa vote sekali",
          };
        }

        await db.insert(votes).values({
          userId: body.user_id,
          candidateId: body.candidate_id,
        });

        set.status = 201;
        return {
          success: true,
          message: "Voting berhasil dilakukan",
        };
      } catch (error: any) {
        set.status = 500;
        return {
          success: false,
          message: "Gagal memproses voting",
          error: error?.message,
        };
      }
    },
    {
      body: t.Object(
        {
          user_id: t.Numeric({
            description: "ID Pemilih (User)",
            examples: [1],
          }),
          candidate_id: t.Numeric({
            description: "ID Pasangan Calon yang dipilih",
            examples: [1],
          }),
        },
        {
          description: "Payload submit surat suara voting",
          examples: [
            {
              user_id: 1,
              candidate_id: 1,
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
            description: "Voting berhasil tercatat",
            examples: [
              {
                success: true,
                message: "Voting berhasil dilakukan",
              },
            ],
          }
        ),
        400: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Voter sudah pernah memilih sebelumnya",
            examples: [
              {
                success: false,
                message: "Voter hanya bisa vote sekali",
              },
            ],
          }
        ),
        404: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "User atau Kandidat tidak ditemukan",
            examples: [
              {
                success: false,
                message: "User tidak ditemukan",
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
            description: "Terjadi kesalahan pada server",
          }
        ),
      },
      detail: {
        tags: ["Votes"],
        summary: "Kirim suara voting",
        description: "Mengirimkan pilihan kandidat. Setiap akun voter hanya dibatasi 1x voting.",
      },
    }
  )

  // 2. Endpoint Vote Count (Quick Count - Publik)
  .get(
    "/count",
    async ({ set }) => {
      try {
        const voteCounts = await db
          .select({
            candidateId: candidates.id,
            candidateNumber: candidates.candidateNumber,
            chairmanName: candidates.chairmanName,
            viceChairmanName: candidates.viceChairmanName,
            photoUrl: candidates.photoUrl,
            totalVotes: sql<number>`cast(count(${votes.id}) as unsigned)`,
          })
          .from(candidates)
          .leftJoin(votes, eq(candidates.id, votes.candidateId))
          .groupBy(candidates.id);

        return {
          success: true,
          data: voteCounts,
        };
      } catch (error: any) {
        set.status = 500;
        return {
          success: false,
          message: "Gagal menghitung perolehan suara",
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
                candidateId: t.Number(),
                candidateNumber: t.Number(),
                chairmanName: t.String(),
                viceChairmanName: t.String(),
                photoUrl: t.Nullable(t.String()),
                totalVotes: t.Number(),
              })
            ),
          },
          {
            description: "Rekapitulasi total suara per kandidat",
            examples: [
              {
                success: true,
                data: [
                  {
                    candidateId: 1,
                    candidateNumber: 1,
                    chairmanName: "Ahmad Rizky Pratama",
                    viceChairmanName: "Budi Santoso",
                    photoUrl: "https://example.com/paslon1.jpg",
                    totalVotes: 145,
                  },
                  {
                    candidateId: 2,
                    candidateNumber: 2,
                    chairmanName: "Citra Kirana",
                    viceChairmanName: "Dedi Setiawan",
                    photoUrl: "https://example.com/paslon2.jpg",
                    totalVotes: 98,
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
            description: "Gagal menghitung perolehan suara",
          }
        ),
      },
      detail: {
        tags: ["Votes"],
        summary: "Hitung rekapitulasi suara",
        description: "Melihat perolehan suara real-time tiap kandidat (Quick Count).",
      },
    }
  )

  // 3. Endpoint Admin: Lihat Detail Seluruh Suara Masuk
  .get(
    "/admin/list",
    async ({ requireAdmin, set }) => {
      try {
        await requireAdmin();

        const voteList = await db
          .select({
            id: votes.id,
            voteDate: votes.voteDate,
            user: {
              id: users.id,
              username: users.username,
              role: users.role,
            },
            candidate: {
              id: candidates.id,
              candidateNumber: candidates.candidateNumber,
              chairmanName: candidates.chairmanName,
              viceChairmanName: candidates.viceChairmanName,
              photoUrl: candidates.photoUrl,
            },
          })
          .from(votes)
          .innerJoin(users, eq(votes.userId, users.id))
          .innerJoin(candidates, eq(votes.candidateId, candidates.id));

        return {
          success: true,
          data: voteList,
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
          message: "Gagal mengambil daftar detail suara",
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
                voteDate: t.Any(),
                user: t.Object({
                  id: t.Number(),
                  username: t.String(),
                  role: t.String(),
                }),
                candidate: t.Object({
                  id: t.Number(),
                  candidateNumber: t.Number(),
                  chairmanName: t.String(),
                  viceChairmanName: t.String(),
                  photoUrl: t.Nullable(t.String()),
                }),
              })
            ),
          },
          {
            description: "Daftar detail seluruh suara yang masuk",
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
        tags: ["Votes"],
        summary: "Lihat data suara masuk (Admin)",
        description: "Melihat detail data suara yang masuk (siapa memilih siapa dan waktu vote). Memerlukan akses Admin.",
      },
    }
  )

  // 4. Endpoint Admin: Hapus Suara Spesifik
  .delete(
    "/:id",
    async ({ params, requireAdmin, set }) => {
      try {
        await requireAdmin();

        const voteId = Number(params.id);
        const existingVote = await db
          .select()
          .from(votes)
          .where(eq(votes.id, voteId));

        if (existingVote.length === 0) {
          set.status = 404;
          return {
            success: false,
            message: "Data suara tidak ditemukan",
          };
        }

        await db.delete(votes).where(eq(votes.id, voteId));

        return {
          success: true,
          message: "Data suara berhasil dihapus",
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
          message: "Gagal menghapus data suara",
          error: error?.message,
        };
      }
    },
    {
      params: t.Object({
        id: t.Numeric({
          description: "ID suara (votes.id) yang akan dihapus",
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
            description: "Data suara berhasil dihapus",
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
            description: "Data suara tidak ditemukan",
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
        tags: ["Votes"],
        summary: "Hapus suara spesifik (Admin)",
        description: "Menghapus entri voting tertentu berdasarkan ID. Memerlukan akses Admin.",
      },
    }
  );

