import argon2 from "argon2";
import { userRepository } from "../db/index.js";
import type { CreateUserDTO } from "../types/DTO.js";

class UserService {
	constructor(private readonly repository = userRepository) { }

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

		try {
			return this.repository.createUser({
				...userData,
				password,
			});
		} catch (error) {
			console.error("Error in UserService createUser:", error);
			throw new Error("Failed to create user in service layer");
		}
	}

	async authenticateUser(email: string, password: string) {
		const user = await this.repository.findByEmail(email);
		if (!user) {
			throw new Error("User not found");
		}

		const isPasswordValid = await argon2.verify(user.password, password);
		if (!isPasswordValid) {
			throw new Error("Invalid password");
		}

		return user;
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
