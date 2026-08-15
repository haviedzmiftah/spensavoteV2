import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { candidateRoutes } from "./routes/candidates";
import "dotenv/config";

const port = process.env.PORT || 3000;

const app = new Elysia()
  // Global Middleware
  .use(cors())
  .use(
    swagger({
      path: "/swagger",
      documentation: {
        info: {
          title: "Spensavote V2 API Documentation",
          description: "API Backend untuk sistem E-Voting Spensavote V2",
          version: "1.0.0",
        },
      },
    })
  )

  // Health Check & Welcome Endpoint
  .get("/", () => ({
    app: "Spensavote V2 Backend",
    status: "online",
    timestamp: new Date().toISOString(),
  }))
  .get("/health", () => ({ status: "ok" }))

  // Sub-routes API
  .group("/api", (app) => app.use(candidateRoutes))

  // Start Server
  .listen(port);

console.log(`🚀 Spensavote V2 Server is running at http://${app.server?.hostname}:${app.server?.port}`);
console.log(`📑 Swagger Documentation available at http://${app.server?.hostname}:${app.server?.port}/swagger`);

export type App = typeof app;
