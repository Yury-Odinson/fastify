import type { FastifyInstance } from "fastify";
import { moodService } from "../../mood/index.js";

type AuthenticatedApp = FastifyInstance & {
	authenticate: (req: unknown, reply: unknown) => Promise<void>;
};

export const getMoodRoutes = (app: AuthenticatedApp) => {
	app.get("/api/mood", { preHandler: app.authenticate }, async (request) => {
		const userId = (request.user as { userId?: number } | undefined)?.userId;

		if (!userId) {
			throw app.httpErrors.unauthorized("Unauthorized");
		}

		const page = Number((request.query as { page?: number })?.page ?? 1);
		const limit = Number((request.query as { limit?: number })?.limit ?? 20);

		try {
			const result = await moodService.getMoodEntries(userId, page, limit);

			return result;

		} catch (error) {
			throw error;
		}

	});
};
