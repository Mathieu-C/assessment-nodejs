import { User } from '@Entities';
import jwt from 'jsonwebtoken';
import { AuthConfig } from '@Config';

export class AuthHelper {
	static async checkPassword(password: string, hash: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (password !== hash) {
				reject('Invalid password');
			}
			resolve(true);
		});
	}

	static generateToken(user: User) {
		const data = user.name;

		const accessToken = jwt.sign({ data }, AuthConfig.salt, { expiresIn: 60 * 60 });

		return {
			accessToken,
		};
	}
}
