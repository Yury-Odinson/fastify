import Fastify from "fastify";
import fastifyEnv from "@fastify/env";

import { registerPlugins } from "./plugins/index.js";
import { registerRoutes } from "./routes/index.js";

const envSchema = {
  type: "object",
  required: [],
  properties: {
    NODE_ENV: { type: "string", default: "development" },
    HOST: { type: "string", default: "0.0.0.0" },
    PORT: { type: "number", default: 4000 },
    CORS_ORIGINS: { type: "string", default: "" },
    DATABASE_URL: { type: "string", },
  },
};

type AppConfig = {
  NODE_ENV: string;
  HOST: string;
  PORT: number;
  CORS_ORIGINS: string;
  DATABASE_URL?: string;
};

declare module "fastify" {
  interface FastifyInstance {
    config: AppConfig;
  }
}

export const buildApp = async () => {
  const app = Fastify({
    logger: {
      level: "info",
    },
  });

  await app.register(fastifyEnv, {
    schema: envSchema,
    dotenv: true,
  });

  registerPlugins(app);
  registerRoutes(app);

  return app;
};
