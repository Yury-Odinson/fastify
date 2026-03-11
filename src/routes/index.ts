import type { FastifyInstance } from "fastify";

import { registerHealthRoutes } from "./health/health.route.js";
import { registerUsersRoutes } from "./users/users.route.js";
import { registrationUserRoutes } from "./registration/registration.route.js";
import { authenticateUserRoutes } from "./auth/auth.route.js";
import { refreshTokenRoutes } from "./auth/refresh.route.js";
import { meRoutes } from "./me/me.route.js";
import { createMoodRoutes } from "./mood/createMood.route.js";
import { getMoodRoutes } from "./mood/getMood.route.js";
import { importMoodRoutes } from "./mood/importMood.route.js";
import { updateMoodRoutes } from "./mood/updateMood.route.js";
import { newUserPasswordRoutes } from "./user/newPassword.route.js";
import { newUserNameRoutes } from "./user/newName.route.js";
import { newUserEmailRoutes } from "./user/newEmail.route.js";
import { newUserLangRoutes } from "./user/newLang.route.js";
import { deleteUserRoutes } from "./user/deleteUser.route.js";

export const registerRoutes = (app: FastifyInstance) => {
	registerHealthRoutes(app);
	registerUsersRoutes(app);
	registrationUserRoutes(app);
	authenticateUserRoutes(app);
	refreshTokenRoutes(app);
	meRoutes(app as FastifyInstance & { authenticate: (req: unknown, reply: unknown) => Promise<void> });
	createMoodRoutes(app as FastifyInstance & { authenticate: (req: unknown, reply: unknown) => Promise<void> });
	getMoodRoutes(app as FastifyInstance & { authenticate: (req: unknown, reply: unknown) => Promise<void> });
	importMoodRoutes(app as FastifyInstance & { authenticate: (req: unknown, reply: unknown) => Promise<void> });
	updateMoodRoutes(app as FastifyInstance & { authenticate: (req: unknown, reply: unknown) => Promise<void> });
	newUserPasswordRoutes(app as FastifyInstance & { authenticate: (req: unknown, reply: unknown) => Promise<void> });
	newUserNameRoutes(app as FastifyInstance & { authenticate: (req: unknown, reply: unknown) => Promise<void> });
	newUserEmailRoutes(app as FastifyInstance & { authenticate: (req: unknown, reply: unknown) => Promise<void> });
	newUserLangRoutes(app as FastifyInstance & { authenticate: (req: unknown, reply: unknown) => Promise<void> });
	deleteUserRoutes(app as FastifyInstance & { authenticate: (req: unknown, reply: unknown) => Promise<void> });
};
