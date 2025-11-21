import type { FastifyInstance } from "fastify";
import { userService } from "../../user/index.js";

type GetUsersQuery = {
	page?: number;
	limit?: number;
};

export const registerGetUsersRoutes = (app: FastifyInstance) => {
	app.get<{ Querystring: GetUsersQuery }>("/api/getUsers", async (request) => {
		const {
			page: requestedPage = 1,
			limit: requestedLimit = 20,
		} = request.query ?? {};

		// Ensure numbers even if query params arrive as strings
		const page = Number(requestedPage) || 1;
		const limit = Number(requestedLimit) || 20;

		return {
			users: await userService.getUsers(page, limit),
		};
	});
};
