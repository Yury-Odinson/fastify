export type UserDTO = {
	id: string;
	name: string;
	email: string;
	lang: "en" | "ru";
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
	lang: "en" | "ru";
};
