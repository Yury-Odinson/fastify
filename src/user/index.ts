import argon2 from "argon2";
import { ConflictError, userRepository } from "../db/index.js";
import type { CreateUserDTO, LangDTO } from "../types/DTO.js";
import { AppError } from "../errors/appError.js";

class UserService {
	constructor(
		private readonly repository = userRepository,
	) { }

	async getUserByEmail(email: string) {
		try {
			return await this.repository.findByEmail(email);
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			console.error("Error in UserService getUserByEmail:", error);
			throw new AppError("GET_USER_BY_EMAIL_FAILED", "Failed to get user by email", 500);
		}
	}

	async getUserById(id: number) {
		try {
			return await this.repository.findById(id);
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			console.error("Error in UserService getUserById:", error);
			throw new AppError("GET_USER_BY_ID_FAILED", "Failed to get user by id", 500);
		}
	}

	async getUsers(page: number, limit: number) {
		try {
			return await this.repository.getUsers({ page, limit });
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			console.error("Error in UserService getUsers:", error);
			throw new AppError("GET_USERS_FAILED", "Failed to get users", 500);
		}
	}

	async createUser(userData: CreateUserDTO): Promise<void> {
		const password = await this.hashPassword(userData.password);

		if (userData.name === "") {
			userData.name = this.createUserName();
		}

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
				throw new AppError("EMAIL_ALREADY_IN_USE", "Email already in use", 409);
			}
			if (error instanceof AppError) {
				throw error;
			}
			console.error("Error in UserService createUser:", error);
			throw new AppError("CREATE_USER_FAILED", "Failed to create user", 500);
		}
	}

	async authenticateUser(email: string, password: string) {
		try {
			const user = await this.repository.findByEmail(email);
			if (!user) {
				throw new AppError("INVALID_CREDENTIALS", "Invalid credentials", 401);
			}

			const isPasswordValid = await argon2.verify(user.password, password);
			if (!isPasswordValid) {
				throw new AppError("INVALID_CREDENTIALS", "Invalid credentials", 401);
			}

			const { password: _password, ...safeUser } = user;
			return safeUser;
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			console.error("Error in UserService authenticateUser:", error);
			throw new AppError("AUTHENTICATE_USER_FAILED", "Failed to authenticate user", 500);
		}
	}

	async changeUserPassword(userId: number, newPassword: string): Promise<void> {

		const hashedPassword = await this.hashPassword(newPassword);

		try {
			return this.repository.changeUserPassword(userId, hashedPassword);
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			console.error("Error in UserService ChangeUserPassword:", error);
			throw new AppError("CHANGE_USER_PASSWORD_FAILED", "Failed to change user password", 500);
		}
	}

	async changeUserName(userId: number, newName: string): Promise<void> {
		try {
			return this.repository.changeUserName(userId, newName);
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			console.error("Error in UserService ChangeUserName:", error);
			throw new AppError("CHANGE_USER_NAME_FAILED", "Failed to change user name", 500);
		}
	}

	async changeUserEmail(userId: number, newEmail: string): Promise<void> {
		try {
			const normalizedEmail = newEmail.toLowerCase().trim();
			const user = await this.repository.findById(userId);

			if (!user) {
				throw new AppError("USER_NOT_FOUND", "User not found", 404);
			}

			if (user.email === normalizedEmail) {
				throw new AppError("EMAIL_MATCHES_CURRENT", "Email matches current", 409);
			}

			return this.repository.changeUserEmail(userId, normalizedEmail);
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			if (error instanceof ConflictError) {
				throw new AppError("EMAIL_ALREADY_IN_USE", "Email already in use", 409);
			}
			console.error("Error in UserService ChangeUserEmail:", error);
			throw new AppError("CHANGE_USER_EMAIL_FAILED", "Failed to change user email", 500);
		}
	}

	async changeUserLang(userId: number, newLang: LangDTO): Promise<void> {
		try {
			return this.repository.changeUserLang(userId, newLang);
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			console.error("Error in UserService ChangeUserLang:", error);
			throw new AppError("CHANGE_USER_LANG_FAILED", "Failed to change user language", 500);
		}
	}

	async deleteUser(userId: number): Promise<void> {
		try {
			const isDeleted = await this.repository.deleteUser(userId);

			if (!isDeleted) {
				throw new AppError("USER_NOT_FOUND", "User not found", 404);
			}
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			console.error("Error in UserService deleteUser:", error);
			throw new AppError("DELETE_USER_FAILED", "Failed to delete user", 500);
		}
	}

	private async hashPassword(password: string): Promise<string> {
		try {
			return await argon2.hash(password);
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			console.error("Error hashing password:", error);
			throw new AppError("HASH_PASSWORD_FAILED", "Failed to hash password", 500);
		}
	}

	private createUserName(): string {
		const array = new Uint8Array(8);
		crypto.getRandomValues(array);
		const secureResult = Array.from(array, byte => byte % 10).join("").slice(0, 8);

		return `user-${secureResult}`;
	}
}

export const userService = new UserService();
