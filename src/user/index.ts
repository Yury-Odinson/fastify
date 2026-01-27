import argon2 from "argon2";
import { ConflictError, userRepository } from "../db/index.js";
import type { CreateUserDTO } from "../types/DTO.js";

class UserService {
	constructor(private readonly repository = userRepository) { }

	getUserByEmail(email: string) {
		try {
			return this.repository.findByEmail(email);
		} catch (error) {
			console.error("Error in UserService getUserByEmail:", error);
			throw new Error("Failed to get user by email in service layer");
		}
	}

	getUsers(page: number, limit: number) {
		try {
			return this.repository.getUsers({ page, limit });
		} catch (error) {
			console.error("Error in UserService getUsers:", error);
			throw new Error("Failed to get users in service layer");
		}
	}

	async createUser(userData: CreateUserDTO): Promise<void> {
		const password = await this.hashPassword(userData.password);

		if (!userData.lang) {
			userData.lang = "ru";
		}

		try {
			return this.repository.createUser({
				...userData,
				password,
			});
		} catch (error) {
			if (error instanceof ConflictError) {
				throw error;
			}
			console.error("Error in UserService createUser:", error);
			throw new Error("Failed to create user in service layer");
		}
	}

	async authenticateUser(email: string, password: string) {
		const user = await this.repository.findByEmail(email);
		if (!user) {
			throw new Error("Invalid credentials");
		}

		const isPasswordValid = await argon2.verify(user.password, password);
		if (!isPasswordValid) {
			throw new Error("Invalid credentials");
		}

		const { password: _password, ...safeUser } = user;
		return safeUser;
	}

	async ChangeUserPassword(userId: number, newPassword: string): Promise<void> {
		
		const hashedPassword = await this.hashPassword(newPassword);

		try {
			return this.repository.ChangeUserPassword(userId, hashedPassword);
		} catch (error) {
			console.error("Error in UserService ChangeUserPassword:", error);
			throw new Error("Failed to change user password in service layer");
		}
	}

	private async hashPassword(password: string): Promise<string> {
		try {
			return await argon2.hash(password);
		} catch (error) {
			console.error("Error hashing password:", error);
			throw new Error("Failed to hash password");
		}
	}
}

export const userService = new UserService();
