import { Elysia, t } from "elysia";
import { db } from "../../db";
import { candidates } from "../../db/schema";

export const candidateRoutes = new Elysia({ prefix: "/candidates" })
  // 1. Dapatkan semua data kandidat
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

  // 2. Tambah data kandidat baru
  .post(
    "/",
    async ({ body, set }) => {
      try {
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
        candidate_number: t.Numeric(),
        chairman_name: t.String(),
        vice_chairman_name: t.String(),
        vision: t.String(),
        mission: t.String(),
        photo_url: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Candidates"],
        summary: "Tambah data kandidat baru",
      },
    }
  );
