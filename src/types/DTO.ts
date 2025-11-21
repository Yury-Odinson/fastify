type UserDTO = {
	id: string;
	name: string;
	email: string;
	lang: string;
};

export type UserListDTO = {
	users: UserDTO[];
	total: number;
	currentPage: number;
	totalPages: number;
}
