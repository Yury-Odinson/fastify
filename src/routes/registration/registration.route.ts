import type { FastifyInstance } from "fastify";
import { userService } from "../../user/index.js";

type RegistrationBody = {
	name: string;
	email: string;
	password: string;
	lang?: string;
};

export const registrationUserRoutes = (app: FastifyInstance) => {
	app.post<{ Body: RegistrationBody }>("/api/registration", async (request) => {

		await userService.createUser(request.body);

		return {
			message: "User created"
		}
	});
};
