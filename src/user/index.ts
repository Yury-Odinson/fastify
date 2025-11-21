import { userRepository } from "../db/index.js";
import type { CreateUserDTO } from "../types/DTO.js";

class UserService {
	constructor(private readonly repository = userRepository) { }

	async getUsers(page: number, limit: number) {
		return this.repository.getUsers({page, limit});
	}

	async createUser(userData: CreateUserDTO): Promise<void> {
		await this.repository.createUser(userData);
	}
}

export const userService = new UserService();
