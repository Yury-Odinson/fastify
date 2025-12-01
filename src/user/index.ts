import { userRepository } from "../db/index.js";
import type { CreateUserDTO } from "../types/DTO.js";

class UserService {
	constructor(private readonly repository = userRepository) { }

	async getUsers(page: number, limit: number) {
		return this.repository.getUsers({page, limit});
	}

	async createUser(userData: CreateUserDTO): Promise<void> {

		const hashedPassword = await this.hashPassword(userData.password);

		return this.repository.createUser({
			...userData,
			password: hashedPassword
		});
	}

	private async hashPassword(password: string): Promise<string> {
		
		const argon2 = require("argon2");

		try {
			console.log("Hashing password...", argon2.hash(password));
			return await argon2.hash(password);
		} catch (err) {
			console.error("Error hashing password:", err);
			throw new Error("Failed to hash password");
		}
	}
}

export const userService = new UserService();
