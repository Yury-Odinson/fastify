import type { FastifyInstance } from "fastify";
import { userService } from "../../user/index.js";
import type { CreateUserDTO } from "../../types/DTO.js";

export const registrationUserRoutes = (app: FastifyInstance) => {
	app.post<{ Body: CreateUserDTO }>("/api/registration", async (request) => {

		await userService.createUser(request.body);

		return {
			message: "User created"
		}
	});
};
