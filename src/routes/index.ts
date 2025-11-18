import type { FastifyInstance } from "fastify";

import { registerHealthRoutes } from "./health/health.route.js";

export const registerRoutes = (app: FastifyInstance) => {
  registerHealthRoutes(app);
};
