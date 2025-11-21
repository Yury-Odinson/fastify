export type User = {
	id: string;
	name: string;
	email: string;
	password: string;
	lang: string;
	created_at: Date;
	updated_at: Date;
};

export type CreateUserData = Omit<User, "id" | "created_at" | "updated_at">;
