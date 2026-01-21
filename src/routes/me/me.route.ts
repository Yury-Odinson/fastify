import type { FastifyInstance } from "fastify";
import { userService } from "../../user/index.js";

type AuthenticatedApp = FastifyInstance & {
	authenticate: (req: unknown, reply: unknown) => Promise<void>;
};

export const meRoutes = (app: AuthenticatedApp) => {
	app.get("/api/me", { preHandler: app.authenticate }, async (request) => {
		if (!request.user) {
			throw app.httpErrors.unauthorized("Unauthorized");
		}

		const { email } = request.user as { email: string };

		const userData = await userService.getUserByEmail(email);

		if (!userData) {
			throw app.httpErrors.notFound("User not found");
		}

		return {
			name: userData.name,
			email: userData.email,
			lang: userData.lang,
		};
	});
};
