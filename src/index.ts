import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { authRoutes } from "./routes/auth";
import { candidateRoutes } from "./routes/candidates";
import { voteRoutes } from "./routes/votes";
import { userRoutes } from "./routes/users";
import { systemRoutes } from "./routes/system";
import "dotenv/config";

const port = process.env.PORT || 3000;

const app = new Elysia()
  // Global Middleware
  .use(cors())
  .use(
    staticPlugin({
      assets: "public/uploads",
      prefix: "/uploads",
    })
  )
  .use(
    swagger({
      path: "/swagger",
      documentation: {
        info: {
          title: "Spensavote V2 API Documentation",
          description: "API Backend untuk sistem E-Voting Spensavote V2 (ElysiaJS + Drizzle + MySQL)",
          version: "1.0.0",
        },
      },
    })
  )

  // Health Check & Root Endpoint
  .get("/", () => ({
    app: "Spensavote V2 Backend",
    status: "online",
    timestamp: new Date().toISOString(),
  }))
  .get("/health", () => ({ status: "ok" }))

  // Sub-routes API
  .group("/api", (app) =>
    app
      .use(authRoutes)
      .use(candidateRoutes)
      .use(voteRoutes)
      .use(userRoutes)
      .use(systemRoutes)
  )

  // Start Server
  .listen(port);

console.log(`🚀 Spensavote V2 Server is running at http://${app.server?.hostname}:${app.server?.port}`);
console.log(`📑 Swagger Documentation available at http://${app.server?.hostname}:${app.server?.port}/swagger`);

export type App = typeof app;
