export type LangDTO = "en" | "ru";

export type UserDTO = {
	id: string;
	name: string;
	email: string;
	lang: LangDTO;
};

export type UserListDTO = {
	users: UserDTO[];
	total: number;
	currentPage: number;
	totalPages: number;
}

export type CreateUserDTO = {
	name: string;
	email: string;
	password: string;
	lang: LangDTO;
};

export type AuthenticateUserDTO = {
	email: string;
	password: string;
};

export type MoodEntryDTO = {
	userId: number;
	moodId: number;
	note?: string | undefined;
};
