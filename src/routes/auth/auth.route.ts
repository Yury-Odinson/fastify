import type { FastifyInstance } from "fastify";
import { authService } from "../../auth/index.js";
import type { AuthenticateUserDTO } from "../../types/DTO.js";

export const authenticateUserRoutes = (app: FastifyInstance) => {
	app.post<{ Body: AuthenticateUserDTO }>("/api/auth", async (request) => {

		const { user, accessToken, accessTokenExpiresIn, refreshToken, refreshTokenExpiresAt } = await authService.login(
			request.body.email,
			request.body.password,
			request.headers["user-agent"]
		);

		return {
			accessToken,
			accessTokenExpiresIn,
			refreshToken,
			refreshTokenExpiresAt,
			user
		}
	});
};
