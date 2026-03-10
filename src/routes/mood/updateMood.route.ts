import { AppError } from "../../errors/appError.js";
import { toHttpError } from "../../errors/toHttpError.js";
import { moodService } from "../../mood/index.js";
import type { AuthenticatedApp } from "../../types/shared.js";

type UpdateMoodBody = {
	moodId?: number;
	note?: string;
};

type MoodEntryParams = {
	entryId?: string;
};

export const updateMoodRoutes = (app: AuthenticatedApp) => {
	app.patch<{ Params: MoodEntryParams; Body: UpdateMoodBody }>("/api/mood/:entryId", { preHandler: app.authenticate }, async (request) => {
		const rawEntryId = (request.params as MoodEntryParams).entryId;
		const entryId = Number(rawEntryId);

		if (!Number.isInteger(entryId) || entryId <= 0) {
			throw app.httpErrors.badRequest("Invalid entryId");
		}

		const { moodId, note } = request.body ?? {};
		if (moodId === undefined && note === undefined) {
			throw app.httpErrors.badRequest("At least one field is required: moodId or note");
		}

		if (moodId !== undefined && (!Number.isInteger(moodId) || moodId <= 0)) {
			throw app.httpErrors.badRequest("Invalid moodId");
		}

		const userId = (request.user as { userId?: number } | undefined)?.userId;
		if (!userId) {
			throw app.httpErrors.unauthorized("Unauthorized");
		}

		try {
			await moodService.updateMoodEntry(userId, { entryId, moodId, note });
			return { message: "Mood entry updated" };
		} catch (error) {
			if (error instanceof AppError) {
				throw toHttpError(app, error);
			}
			console.error("Error in updateMoodRoute:", error);
			throw app.httpErrors.internalServerError("Failed to update mood entry");
		}
	});

	app.delete<{ Params: MoodEntryParams }>("/api/mood/:entryId", { preHandler: app.authenticate }, async (request) => {
		const rawEntryId = (request.params as MoodEntryParams).entryId;
		const entryId = Number(rawEntryId);

		if (!Number.isInteger(entryId) || entryId <= 0) {
			throw app.httpErrors.badRequest("Invalid entryId");
		}

		const userId = (request.user as { userId?: number } | undefined)?.userId;
		if (!userId) {
			throw app.httpErrors.unauthorized("Unauthorized");
		}

		try {
			await moodService.deleteMoodEntry(userId, entryId);
			return { message: "Mood entry deleted" };
		} catch (error) {
			if (error instanceof AppError) {
				throw toHttpError(app, error);
			}
			console.error("Error in deleteMoodRoute:", error);
			throw app.httpErrors.internalServerError("Failed to delete mood entry");
		}
	});
};
