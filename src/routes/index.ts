import type { FastifyInstance } from "fastify";

import { registerHealthRoutes } from "./health/health.route.js";
import { registerUsersRoutes } from "./users/users.route.js";
import { registrationUserRoutes } from "./registration/registration.route.js";
import { authenticateUserRoutes } from "./auth/auth.route.js";

export const registerRoutes = (app: FastifyInstance) => {
	registerHealthRoutes(app);
	registerUsersRoutes(app);
	registrationUserRoutes(app);
	authenticateUserRoutes(app);
};
