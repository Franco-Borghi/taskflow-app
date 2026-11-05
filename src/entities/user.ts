export type AuthUser = {
	uid: string;
	email: string;
	displayName: string;
};

export type SignInInput = {
	email: string;
	password: string;
};

export type CreateAccountInput = SignInInput & {
	name: string;
};
