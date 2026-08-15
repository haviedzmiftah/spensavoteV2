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
      },
      detail: {
        tags: ["Candidates"],
        summary: "Dapatkan semua kandidat",
        description: "Mengambil daftar seluruh pasangan calon kandidat ketua & wakil ketua.",
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
      },
      detail: {
        tags: ["Candidates"],
        summary: "Tambah kandidat baru",
        description: "Menambahkan pasangan calon ketua & wakil ketua baru.",
      },
    }
  );
