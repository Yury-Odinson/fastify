import { moodService } from "../../mood/index.js";
import { AppError } from "../../errors/appError.js";
import { toHttpError } from "../../errors/toHttpError.js";
import type { ImportMoodEntryDTO } from "../../types/DTO.js";
import type { AuthenticatedApp } from "../../types/shared.js";

type ImportMoodBody = {
	entries?: ImportMoodEntryDTO[];
};

export const importMoodRoutes = (app: AuthenticatedApp) => {
	app.post<{ Body: ImportMoodBody }>("/api/mood/import", { preHandler: app.authenticate }, async (request) => {
		const { entries } = request.body ?? {};

		if (!entries || !Array.isArray(entries)) {
			throw app.httpErrors.badRequest("Missing required field: entries");
		}

		const userId = (request.user as { userId?: number } | undefined)?.userId;
		if (!userId) {
			throw app.httpErrors.unauthorized("Unauthorized");
		}

		try {
			const result = await moodService.importMoodEntries(userId, entries);

			return {
				message: "Mood entries imported",
				...result
			};
		} catch (error) {
			if (error instanceof AppError) {
				throw toHttpError(app, error);
			}
			throw error;
		}
	});
};
