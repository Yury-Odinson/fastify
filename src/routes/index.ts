import type { FastifyInstance } from "fastify";

import { registerHealthRoutes } from "./health/health.route.js";
import { registerGetUsersRoutes } from "./getUsers/getUsers.route.js";
import { registrationUserRoutes } from "./registration/registration.route.js";

export const registerRoutes = (app: FastifyInstance) => {
	registerHealthRoutes(app);
	registerGetUsersRoutes(app);
	registrationUserRoutes(app);
};
