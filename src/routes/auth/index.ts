import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import { authPlugin } from "../../middlewares/auth";

export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(authPlugin)

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

  // 2. Endpoint Login Umum (Admin / Voters)
  .post(
    "/login",
    async ({ body, jwt, set }) => {
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

        // Verifikasi password hash
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

        // Generate JWT Access Token
        const token = await jwt.sign({
          id: user.id,
          username: user.username,
          role: user.role,
        });

        return {
          success: true,
          message: "Login berhasil",
          token,
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
        summary: "Login akun (Admin / Voters) & generate JWT token",
      },
    }
  )

  // 3. Endpoint Login Khusus Admin (Validasi Role Admin)
  .post(
    "/login/admin",
    async ({ body, jwt, set }) => {
      try {
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

        // Validasi role admin
        if (user.role !== "admin") {
          set.status = 403;
          return {
            success: false,
            message: "Akses ditolak: Akun ini bukan administrator",
          };
        }

        // Verifikasi password hash
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

        // Generate JWT Access Token
        const token = await jwt.sign({
          id: user.id,
          username: user.username,
          role: user.role,
        });

        return {
          success: true,
          message: "Login Admin berhasil",
          token,
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
          message: "Terjadi kesalahan saat login admin",
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
        summary: "Login khusus Administrator",
      },
    }
  )

  // 4. Endpoint Profil User Aktif (Get Current User / Me)
  .get(
    "/me",
    async ({ getCurrentUser, set }) => {
      try {
        const currentUser = await getCurrentUser();
        return {
          success: true,
          user: currentUser,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error?.message || "Unauthorized",
        };
      }
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Ambil data user yang sedang login dari token JWT",
      },
    }
  );
