import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { refreshTokens, users } from "./schema.js";
import { eq, sql } from "drizzle-orm";
import type { CreateUserData } from "../types/dbTypes.js";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

class UserRepository {
	constructor(readonly dbClient: typeof db) { }

	async getUsers({ page = 1, limit = 20 }: { page: number, limit: number }) {
		try {
			const offset = (page - 1) * limit;

			const countResult = await this.dbClient
				.select({ count: sql`count(*)`.mapWith(Number) })
				.from(users);
			const count = countResult[0]?.count ?? 0;

			const data = await this.dbClient
				.select({ id: users.id, name: users.name, email: users.email, lang: users.lang })
				.from(users)
				.limit(limit)
				.offset(offset)
				.orderBy(users.id);

			return {
				data,
				total: Number(count),
				currentPage: page,
				totalPages: Math.ceil(Number(count) / limit)
			};
		} catch (error) {
			console.error("Error fetching users:", error);
			throw new Error("Failed to fetch users");
		}
	}

	async createUser(userData: CreateUserData): Promise<void> {
		try {
			await this.dbClient
				.insert(users)
				.values({
					name: userData.name,
					email: userData.email,
					password: userData.password,
					lang: userData.lang
				})
		} catch (error) {
			console.error("Error creating user:", error);
			throw new Error("Failed to create user");
		}
	}

	async findByEmail(email: string) {
		try {
			const [user] = await this.dbClient.select().from(users).where(eq(users.email, email)).limit(1);
			return user;
		} catch (error) {
			console.error("Error finding user by email:", error);
			throw new Error("Failed to find user by email");
		}
	}
}

class RefreshTokenRepository {
	constructor(readonly dbClient: typeof db) { }

	async createToken(params: { userId: number, token: string, expiresAt: Date, userAgent?: string | null | undefined }) {
		try {
			await this.dbClient.insert(refreshTokens).values({
				userId: params.userId,
				token: params.token,
				expiresAt: params.expiresAt,
				userAgent: params.userAgent ?? null,
			});
		} catch (error) {
			console.error("Error creating refresh token:", error);
			throw new Error("Failed to create refresh token");
		}
	}

	async findByToken(token: string) {
		try {
			const [row] = await this.dbClient.select().from(refreshTokens).where(eq(refreshTokens.token, token)).limit(1);
			return row;
		} catch (error) {
			console.error("Error finding refresh token:", error);
			throw new Error("Failed to find refresh token");
		}
	}

	async revokeToken(token: string) {
		try {
			await this.dbClient
				.update(refreshTokens)
				.set({ revoked: true })
				.where(eq(refreshTokens.token, token));
		} catch (error) {
			console.error("Error revoking refresh token:", error);
			throw new Error("Failed to revoke refresh token");
		}
	}
}

export const userRepository = new UserRepository(db);
export const refreshTokenRepository = new RefreshTokenRepository(db);
