import { userRepository } from "../db/index.js";
import type { User } from "../types/dbTypes.js";

class UserService {
	constructor(private readonly repository = userRepository) { }

	async getUsers(page: number, limit: number) {
		return this.repository.getUsers({page, limit});
	}

	async createUser(userData: User): Promise<void> {

		await this.repository.createUser(userData);

	}
}

export const userService = new UserService();
