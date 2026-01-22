import type { FastifyInstance } from "fastify";
import { moodService } from "../../mood/index.js";
import type { MoodEntryDTO } from "../../types/DTO.js";

type CreateMoodEntryBody = {
	moodId?: number;
	note?: string;
};

type AuthenticatedApp = FastifyInstance & {
	authenticate: (req: unknown, reply: unknown) => Promise<void>;
};

export const createMoodRoutes = (app: AuthenticatedApp) => {
	app.post<{ Body: CreateMoodEntryBody }>("/api/mood", { preHandler: app.authenticate }, async (request) => {
		const { moodId, note } = request.body ?? {};

		if (!moodId) {
			throw app.httpErrors.badRequest("Missing required field: moodId");
		};

		const userId = (request.user as { userId?: number } | undefined)?.userId;
		if (!userId) {
			throw app.httpErrors.unauthorized("Unauthorized");
		}

		try {
			await moodService.createMoodEntry({
				userId,
				moodId,
				note
			} as MoodEntryDTO);

			return { message: "Mood entry created" };

		} catch (error) {
			throw error;
		}

	});
};
