import { userRepository } from "../db/index.js";

class UserService {
	constructor(private readonly repository = userRepository) { }

	async getUsers(page: number, limit: number) {
		return this.repository.getUsers({page, limit});
	}
}

export const userService = new UserService();
