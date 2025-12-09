import { randomBytes } from "node:crypto";
import { refreshTokenRepository } from "../db/index.js";
import { userService } from "../user/index.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 30);
const ACCESS_TOKEN_TTL_MINUTES = Number(process.env.ACCESS_TOKEN_TTL_MINUTES ?? 15);

const generateToken = (bytes = 32) => randomBytes(bytes).toString("hex");

class AuthService {
	async login(email: string, password: string, userAgent?: string) {
		const user = await userService.authenticateUser(email, password);

		const accessToken = generateToken(24);
		const refreshToken = generateToken(48);
		const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * DAY_MS);

		await refreshTokenRepository.createToken({
			userId: user.id,
			token: refreshToken,
			expiresAt: refreshExpiresAt,
			userAgent,
		});

		return {
			user,
			accessToken,
			accessTokenExpiresIn: ACCESS_TOKEN_TTL_MINUTES * 60,
			refreshToken,
			refreshTokenExpiresAt: refreshExpiresAt,
		};
	}
}

export const authService = new AuthService();
