import { Elysia, t } from "elysia";
import { eq, sql } from "drizzle-orm";
import { db } from "../../db";
import { votes, candidates, users } from "../../db/schema";

export const voteRoutes = new Elysia({ prefix: "/votes" })
  // 1. Endpoint Vote (Hanya bisa vote sekali)
  .post(
    "/",
    async ({ body, set }) => {
      try {
        // Cek apakah user_id valid
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

        // Cek apakah candidate_id valid
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

        // Validasi Bisnis: Cek apakah user sudah pernah vote
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

        // Masukkan data voting
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
      body: t.Object({
        user_id: t.Numeric(),
        candidate_id: t.Numeric(),
      }),
      detail: {
        tags: ["Votes"],
        summary: "Kirim suara voting (voter hanya bisa vote sekali)",
      },
    }
  )

  // 2. Endpoint Vote Count (Hitung perolehan suara tiap kandidat)
  .get(
    "/count",
    async () => {
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
        return {
          success: false,
          message: "Gagal menghitung perolehan suara",
          error: error?.message,
        };
      }
    },
    {
      detail: {
        tags: ["Votes"],
        summary: "Dapatkan rekapitulasi jumlah suara setiap kandidat",
      },
    }
  );
