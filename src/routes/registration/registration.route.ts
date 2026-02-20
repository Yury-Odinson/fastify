import type { FastifyInstance } from "fastify";
import { userService } from "../../user/index.js";
import { ConflictError, refreshTokenRepository } from "../../db/index.js";
import type { CreateUserDTO } from "../../types/DTO.js";
import argon2 from "argon2";

export const registrationUserRoutes = (app: FastifyInstance) => {
	app.post<{ Body: CreateUserDTO }>("/api/registration", async (request, reply) => {

		const { name = "", email, password, lang } = request.body ?? {};

		if (!email || !password) {
			throw app.httpErrors.badRequest("Missing required fields: email, or password");
		};

		try {
			const normalizedEmail = email.toLowerCase().trim();

			await userService.createUser({
				name,
				email: normalizedEmail,
				password,
				lang: lang || "en"
			} as CreateUserDTO);

			const userData = await userService.authenticateUser(normalizedEmail, password);
			const client = request.headers["x-client"] || "web";

			const accessToken = app.jwt.sign(
				{ email: normalizedEmail, userId: userData.id },
				{ expiresIn: `${app.config.ACCESS_TOKEN_TTL_MINUTES}m` }
			);
			const refreshToken = app.jwt.sign(
				{ email: normalizedEmail },
				{ expiresIn: `${app.config.REFRESH_TOKEN_TTL_DAYS}d` }
			);
			const hashedRefreshToken = await argon2.hash(refreshToken);

			await refreshTokenRepository.createToken({
				userId: userData.id,
				token: hashedRefreshToken,
				expiresAt: new Date(Date.now() + app.config.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
				userAgent: request.headers["user-agent"]
			});

			if (client === "mobile") {
				return { message: "User created", accessToken, refreshToken };
			}

			reply.setCookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: app.config.NODE_ENV === "production",
				sameSite: "lax",
				path: "/api/auth",
				maxAge: app.config.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60,
			});

			return { message: "User created", accessToken };

		} catch (error) {
			if (error instanceof ConflictError) {
				throw app.httpErrors.conflict("Email already in use");
			}
			throw error;
		}

	});
};
