import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import type { FastifyInstance } from "fastify";

const parseCorsOrigins = (origins: string) =>
  origins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const registerPlugins = (app: FastifyInstance) => {
  const isProd = app.config.NODE_ENV === "production";
  const corsOrigins = parseCorsOrigins(app.config.CORS_ORIGINS);

  app.register(sensible);

  app.register(cookie, {
    parseOptions: {
      httpOnly: true,
      sameSite: isProd ? "strict" : "lax",
      secure: isProd,
    },
  });

  app.register(cors, {
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  });

  app.register(helmet, {
    contentSecurityPolicy: false,
  });
};
