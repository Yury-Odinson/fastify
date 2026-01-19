import type { FastifyInstance } from "fastify";
import { userService } from "../../user/index.js";
import { ConflictError } from "../../db/index.js";
import type { CreateUserDTO } from "../../types/DTO.js";

export const registrationUserRoutes = (app: FastifyInstance) => {
	app.post<{ Body: CreateUserDTO }>("/api/registration", async (request) => {

		const { name, email, password, lang } = request.body ?? {};

		if (!name || !email || !password) {
			throw app.httpErrors.badRequest("Missing required fields: name, email, or password");
		};

		try {
			await userService.createUser({
				name,
				email: email.toLowerCase().trim(),
				password,
				lang: lang || "en"
			} as CreateUserDTO);

			return { message: "User created" };

		} catch (error) {
			if (error instanceof ConflictError) {
				throw app.httpErrors.conflict("Email already in use");
			}
			throw error;
		}

	});
};
