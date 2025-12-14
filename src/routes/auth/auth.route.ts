import type { FastifyInstance } from "fastify";
import type { AuthenticateUserDTO } from "../../types/DTO.js";
import { userService } from "../../user/index.js";
import argon2 from "argon2";
import { refreshTokenRepository } from "../../db/index.js";

export const authenticateUserRoutes = (app: FastifyInstance) => {
	app.post<{ Body: AuthenticateUserDTO }>("/api/auth", async (request) => {

		const { email, password } = request.body;

		const userData = await userService.authenticateUser(email, password);

		const accessToken = app.jwt.sign({ email }, { expiresIn: `${app.config.ACCESS_TOKEN_TTL_MINUTES}m` });
		const refreshToken = app.jwt.sign({ email }, { expiresIn: `${app.config.REFRESH_TOKEN_TTL_DAYS}d` });

		const hashedRefreshToken = await argon2.hash(refreshToken);

		refreshTokenRepository.createToken({
			userId: userData.id,
			token: hashedRefreshToken,
			expiresAt: new Date(Date.now() + app.config.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
			userAgent: request.headers["user-agent"]
		});

		return {
			message: "User authenticated",
			accessToken,
			refreshToken
		}
	});
};
