export enum role {
	ADMIN = 'admin',
	USER = 'user',
}

export namespace IUser {
	export interface LoginInDto {
		name: string;
		password: string;
	}

	export interface LoginOutDto {
		id: string;
		accessToken: string;
	}

	export interface ResolveTokenInDto {
		token: string;
	}

	export interface ResolveTokenOutDto {
		id: string;
		name: string;
	}

	export interface GetInDto {
		id: string;
	}

	export interface GetOutDto {
		email: string;
		id: string;
		name: string;
		role: role;
	}

	export interface GetByNameInDto {
		name: string;
	}
}
