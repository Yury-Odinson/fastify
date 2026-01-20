import type { FastifyInstance } from "fastify";
import { refreshTokenRepository, userRepository } from "../../db/index.js";
import argon2 from "argon2";

type RefreshTokenBody = {
	refreshToken?: string;
};

export const refreshTokenRoutes = (app: FastifyInstance) => {
	app.post<{ Body: RefreshTokenBody }>("/api/auth/refresh", async (request) => {
		const { refreshToken } = request.body ?? {};
		if (!refreshToken) {
			throw app.httpErrors.badRequest("Refresh token is required");
		}

		let payload: { email?: string };
		try {
			payload = app.jwt.verify(refreshToken);
		} catch {
			throw app.httpErrors.unauthorized("Invalid refresh token");
		}

		const email = payload?.email;
		if (!email) {
			throw app.httpErrors.unauthorized("Invalid refresh token");
		}

		try {
			const user = await userRepository.findByEmail(email);
			if (!user) {
				throw app.httpErrors.unauthorized("Invalid refresh token");
			}

			const activeTokens = await refreshTokenRepository.findActiveByUserId(user.id);

			let matchedToken: { id: string; token: string } | null = null;
			for (const tokenRow of activeTokens) {
				const isMatch = await argon2.verify(tokenRow.token, refreshToken);
				if (isMatch) {
					matchedToken = { id: tokenRow.id, token: tokenRow.token };
					break;
				}
			}

			if (!matchedToken) {
				throw app.httpErrors.unauthorized("Invalid refresh token");
			}

			await refreshTokenRepository.revokeTokenById(matchedToken.id);

			const accessToken = app.jwt.sign(
				{ email },
				{ expiresIn: `${app.config.ACCESS_TOKEN_TTL_MINUTES}m` }
			);
			const newRefreshToken = app.jwt.sign(
				{ email },
				{ expiresIn: `${app.config.REFRESH_TOKEN_TTL_DAYS}d` }
			);
			const hashedRefreshToken = await argon2.hash(newRefreshToken);

			await refreshTokenRepository.createToken({
				userId: user.id,
				token: hashedRefreshToken,
				expiresAt: new Date(Date.now() + app.config.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
				userAgent: request.headers["user-agent"]
			});

			return {
				accessToken,
				refreshToken: newRefreshToken
			};
		} catch (error) {
			if (error instanceof Error && error.message === "Invalid refresh token") {
				throw app.httpErrors.unauthorized("Invalid refresh token");
			}
			throw error;
		}
	});
};
