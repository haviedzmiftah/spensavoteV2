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
      body: t.Object(
        {
          username: t.String({
            description: "Username unik untuk akun",
            examples: ["admin_sekolah", "siswa_10a_01"],
          }),
          password: t.String({
            description: "Password akun",
            examples: ["passwordRahasia123"],
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
          description: "Payload pendaftaran akun baru",
          examples: [
            {
              username: "siswa_10a_01",
              password: "passwordRahasia123",
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
            description: "Pendaftaran berhasil",
            examples: [
              {
                success: true,
                message: "User berhasil didaftarkan",
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
            description: "Validasi gagal / username duplikat",
            examples: [
              {
                success: false,
                message: "Username sudah terdaftar",
              },
            ],
          }
        ),
      },
      detail: {
        tags: ["Auth"],
        summary: "Register akun baru",
        description: "Mendaftarkan pengguna baru dengan role admin atau voters.",
      },
    }
  )

  // 2. Endpoint Login Umum
  .post(
    "/login",
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
      body: t.Object(
        {
          username: t.String({
            description: "Username yang terdaftar",
            examples: ["siswa_10a_01"],
          }),
          password: t.String({
            description: "Password akun",
            examples: ["passwordRahasia123"],
          }),
        },
        {
          description: "Payload login kredensial",
          examples: [
            {
              username: "siswa_10a_01",
              password: "passwordRahasia123",
            },
          ],
        }
      ),
      response: {
        200: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
            token: t.String(),
            user: t.Object({
              id: t.Number(),
              username: t.String(),
              role: t.String(),
            }),
          },
          {
            description: "Login berhasil dan token JWT diberikan",
            examples: [
              {
                success: true,
                message: "Login berhasil",
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                user: {
                  id: 1,
                  username: "siswa_10a_01",
                  role: "voters",
                },
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
            description: "Kredensial tidak valid",
            examples: [
              {
                success: false,
                message: "Username atau password salah",
              },
            ],
          }
        ),
      },
      detail: {
        tags: ["Auth"],
        summary: "Login akun & Dapatkan JWT",
        description: "Autentikasi akun pengguna dan menghasilkan token akses JWT.",
      },
    }
  )

  // 3. Endpoint Login Khusus Admin
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

        if (user.role !== "admin") {
          set.status = 403;
          return {
            success: false,
            message: "Akses ditolak: Akun ini bukan administrator",
          };
        }

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
      body: t.Object(
        {
          username: t.String({
            description: "Username administrator",
            examples: ["admin_sekolah"],
          }),
          password: t.String({
            description: "Password administrator",
            examples: ["adminSecretPass!"],
          }),
        },
        {
          description: "Payload login khusus administrator",
          examples: [
            {
              username: "admin_sekolah",
              password: "adminSecretPass!",
            },
          ],
        }
      ),
      response: {
        200: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
            token: t.String(),
            user: t.Object({
              id: t.Number(),
              username: t.String(),
              role: t.String(),
            }),
          },
          {
            description: "Login admin berhasil",
            examples: [
              {
                success: true,
                message: "Login Admin berhasil",
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                user: {
                  id: 1,
                  username: "admin_sekolah",
                  role: "admin",
                },
              },
            ],
          }
        ),
        403: t.Object(
          {
            success: t.Boolean(),
            message: t.String(),
          },
          {
            description: "Akses ditolak untuk akun non-admin",
            examples: [
              {
                success: false,
                message: "Akses ditolak: Akun ini bukan administrator",
              },
            ],
          }
        ),
      },
      detail: {
        tags: ["Auth"],
        summary: "Login khusus Admin",
        description: "Khusus untuk login administrator dengan proteksi role.",
      },
    }
  )

  // 4. Endpoint Profil User Aktif
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
      response: {
        200: t.Object(
          {
            success: t.Boolean(),
            user: t.Object({
              id: t.Number(),
              username: t.String(),
              role: t.String(),
              exp: t.Optional(t.Number()),
              iat: t.Optional(t.Number()),
            }),
          },
          {
            description: "Data user yang sedang login",
            examples: [
              {
                success: true,
                user: {
                  id: 1,
                  username: "siswa_10a_01",
                  role: "voters",
                  exp: 1787411504,
                  iat: 1786806704,
                },
              },
            ],
          }
        ),
      },
      detail: {
        tags: ["Auth"],
        summary: "Ambil profil user aktif (Me)",
        description: "Mendapatkan identitas user dari token Authorization Bearer.",
      },
    }
  );
