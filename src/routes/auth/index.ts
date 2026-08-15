import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export const authRoutes = new Elysia({ prefix: "/auth" })
  // 1. Endpoint Register User
  .post(
    "/register",
    async ({ body, set }) => {
      try {
        // Cek apakah username sudah terdaftar
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

        // Hashing password menggunakan built-in Bun hasher
        const hashedPassword = await Bun.password.hash(body.password, {
          algorithm: "bcrypt",
          cost: 10,
        });

        // Insert user baru ke database
        await db.insert(users).values({
          username: body.username,
          password: hashedPassword,
          role: body.role || "voters",
        });

        set.status = 201;
        return {
          success: true,
          message: "User berhasil didaftarkan",
        };
      } catch (error: any) {
        set.status = 500;
        return {
          success: false,
          message: "Gagal mendaftarkan user",
          error: error?.message,
        };
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
        role: t.Optional(t.Union([t.Literal("admin"), t.Literal("voters")])),
      }),
      detail: {
        tags: ["Auth"],
        summary: "Register user baru (admin/voters)",
      },
    }
  )

  // 2. Endpoint Login
  .post(
    "/login",
    async ({ body, set }) => {
      try {
        // Cari user berdasarkan username
        const userList = await db
          .select()
          .from(users)
          .where(eq(users.username, body.username));

        if (userList.length === 0) {
          set.status = 401;
          return {
            success: false,
            message: "Username atau password salah",
          };
        }

        const user = userList[0];

        // Verifikasi password yang dikirim dengan hash di database
        const isPasswordMatch = await Bun.password.verify(
          body.password,
          user.password
        );

        if (!isPasswordMatch) {
          set.status = 401;
          return {
            success: false,
            message: "Username atau password salah",
          };
        }

        return {
          success: true,
          message: "Login berhasil",
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
          },
        };
      } catch (error: any) {
        set.status = 500;
        return {
          success: false,
          message: "Terjadi kesalahan saat login",
          error: error?.message,
        };
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
      detail: {
        tags: ["Auth"],
        summary: "Login user (admin/voters)",
      },
    }
  );
