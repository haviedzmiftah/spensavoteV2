import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";

const JWT_SECRET = process.env.JWT_SECRET || "spensavote-secret-key-super-secure-2026";

export const authPlugin = new Elysia({ name: "authPlugin" })
  .use(bearer())
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
      exp: "7d",
    })
  )
  .derive({ as: "scoped" }, async ({ jwt, bearer, set }) => {
    return {
      // Helper untuk memverifikasi user yang sedang login
      getCurrentUser: async () => {
        if (!bearer) {
          set.status = 401;
          throw new Error("Token otentikasi tidak ditemukan");
        }

        const payload = await jwt.verify(bearer);
        if (!payload) {
          set.status = 401;
          throw new Error("Token otentikasi tidak valid atau telah kedaluwarsa");
        }

        return payload as {
          id: number;
          username: string;
          role: string;
        };
      },

      // Helper khusus untuk membatasi akses hanya ke admin
      requireAdmin: async () => {
        if (!bearer) {
          set.status = 401;
          throw new Error("Token otentikasi tidak ditemukan");
        }

        const payload = (await jwt.verify(bearer)) as {
          id: number;
          username: string;
          role: string;
        } | null;

        if (!payload) {
          set.status = 401;
          throw new Error("Token otentikasi tidak valid atau telah kedaluwarsa");
        }

        if (payload.role !== "admin") {
          set.status = 403;
          throw new Error("Akses ditolak: Hanya admin yang diizinkan mengakses fitur ini");
        }

        return payload;
      },
    };
  });
