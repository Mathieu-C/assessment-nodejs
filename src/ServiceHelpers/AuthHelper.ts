import jwt from 'jsonwebtoken';
import { AuthConfig } from '../../config/auth-config';

export class AuthHelper {
	static async checkPassword(password: string, hash: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (password !== hash) {
				reject('Invalid password');
			}
			resolve(true);
		});
	}

	static generateToken(user: any) {
		const data = user.name;

		const accessToken = jwt.sign({ data }, AuthConfig.salt, { expiresIn: 60 * 60 });

		return {
			accessToken,
		};
	}
}
