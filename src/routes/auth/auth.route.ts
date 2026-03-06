import type { FastifyInstance } from "fastify";
import type { AuthenticateUserDTO } from "../../types/DTO.js";
import { userService } from "../../user/index.js";
import argon2 from "argon2";
import { refreshTokenRepository } from "../../db/index.js";
import { AppError } from "../../errors/appError.js";
import { toHttpError } from "../../errors/toHttpError.js";

export const authenticateUserRoutes = (app: FastifyInstance) => {
	app.post<{ Body: AuthenticateUserDTO }>("/api/auth", async (request, reply) => {

		try {

			const { email, password } = request.body;

			const userData = await userService.authenticateUser(email, password);

			const client = request.headers["x-client"] || "web";

			const accessToken = app.jwt.sign(
				{ email, userId: userData.id },
				{ expiresIn: `${app.config.ACCESS_TOKEN_TTL_MINUTES}m` }
			);

			const refreshToken = app.jwt.sign({ email }, { expiresIn: `${app.config.REFRESH_TOKEN_TTL_DAYS}d` });

			const hashedRefreshToken = await argon2.hash(refreshToken);

			await refreshTokenRepository.createToken({
				userId: userData.id,
				token: hashedRefreshToken,
				expiresAt: new Date(Date.now() + app.config.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
				userAgent: request.headers["user-agent"]
			});

			if (client === "mobile") {
				return { message: "User authenticated", accessToken, refreshToken };
			}

			reply.setCookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: app.config.NODE_ENV === "production",
				sameSite: "lax",
				path: "/api/auth",
				maxAge: app.config.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60,
			});

			return {
				message: "User authenticated",
				accessToken
			}
		} catch (error) {
			if (error instanceof AppError) {
				throw toHttpError(app, error);
			}
			throw error;
		}
	});
};
