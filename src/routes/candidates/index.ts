import { Elysia, t } from "elysia";
import { db } from "../../db";
import { candidates } from "../../db/schema";

export const candidateRoutes = new Elysia({ prefix: "/candidates" })
  .get(
    "/",
    async () => {
      try {
        const result = await db.select().from(candidates);
        return {
          success: true,
          data: result,
        };
      } catch (error: any) {
        return {
          success: false,
          message: "Gagal mengambil data kandidat",
          error: error?.message,
        };
      }
    },
    {
      detail: {
        tags: ["Candidates"],
        summary: "Dapatkan semua data kandidat",
      },
    }
  )
  .post(
    "/",
    async ({ body, set }) => {
      try {
        await db.insert(candidates).values(body);
        set.status = 201;
        return {
          success: true,
          message: "Kandidat berhasil ditambahkan",
        };
      } catch (error: any) {
        set.status = 500;
        return {
          success: false,
          message: "Gagal menambahkan kandidat",
          error: error?.message,
        };
      }
    },
    {
      body: t.Object({
        candidateNumber: t.Numeric(),
        chairmanName: t.String(),
        viceChairmanName: t.String(),
        vision: t.String(),
        mission: t.String(),
        photoUrl: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Candidates"],
        summary: "Tambah data kandidat baru",
      },
    }
  );
