import type { FastifyInstance } from "fastify";
import { userService } from "../../user/index.js";
import type { AuthenticateUserDTO } from "../../types/DTO.js";

export const authenticateUserRoutes = (app: FastifyInstance) => {
	app.post<{ Body: AuthenticateUserDTO }>("/api/auth", async (request) => {

		await userService.authenticateUser(request.body.email, request.body.password);

		return {
			message: "Login successful"
		}
	});
};
