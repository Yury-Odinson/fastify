import type { LangDTO } from "../../types/DTO.js";
import type { AuthenticatedApp } from "../../types/shared.js";
import { userService } from "../../user/index.js";
import { isValidLanguage } from "../../utils/languages.js";

export const newUserLangRoutes = async (app: AuthenticatedApp) => {
	app.post<{ Body: { newLang: LangDTO } }>("/api/changeUserLang", { preHandler: app.authenticate }, async (request, reply) => {
		const { newLang } = request.body ?? {};

		if (!newLang) {
			throw app.httpErrors.badRequest("Missing required field: newLang");
		}

		if (!isValidLanguage(newLang)) {
			throw app.httpErrors.badRequest("Invalid language");
		}

		const userId = (request.user as { userId?: number } | undefined)?.userId;
		if (!userId) {
			throw app.httpErrors.unauthorized("Unauthorized");
		}

		try {
			await userService.changeUserLang(userId, newLang);
			return { message: "Language changed successfully" };
		} catch (error) {
			console.error("Error in changeUserLangRoute:", error);
			throw app.httpErrors.internalServerError("Failed to change language");
		}
	});

};
