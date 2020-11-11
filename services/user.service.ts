/* eslint-disable @typescript-eslint/no-explicit-any */
//#region Global Imports
import { Context, Service as MoleculerService } from 'moleculer';
import { Action, Method, Service } from 'moleculer-decorators';
import { getConnection } from 'typeorm';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { Errors as E } from 'moleculer-web';
//#endregion Global Imports

//#region Local Imports
import { AuthConfig } from '@Config';
import connectionInstance from '@Entities/Connection';

//#endregion Local Imports

//#region Interface Imports
import { IUser } from '@Interfaces';
import { Throw404 } from '@Repositories/ErrorHelpers';
import { AuthHelper } from '@ServiceHelpers/AuthHelper';
import { Throw401 } from '@ServiceHelpers/ErrorHelper';
import { UserRepository } from '@Repositories';
import User from '@Entities/User';
//#endregion Interface Imports

@Service({
	name: 'users',
})
class UserService extends MoleculerService {
	public async started() {
		return await connectionInstance();
	}

	@Action({
		params: {
			name: { type: 'string', min: 1, max: 64 },
			password: { type: 'string', min: 1, max: 64 },
		},
	})
	public async Login(ctx: Context<IUser.LoginInDto>): Promise<IUser.LoginOutDto> {
		const response = await this.LoginMethod(ctx);
		return response;
	}

	@Method
	/**
	 * @swagger
	 *
	 *  /user/login:
	 *    post:
	 *      description: Logs in the user.
	 *      produces:
	 *        - application/json
	 *      consumes:
	 *        - application/json
	 *      parameters:
	 *        - in: body
	 *          name: params
	 *          schema:
	 *            type: object
	 *            required:
	 *              - name
	 *              - password
	 *            properties:
	 *              name:
	 *                type: string
	 *                example: Mark
	 *              password:
	 *                type: string
	 *                example: alligator15
	 *      responses:
	 *        200:
	 *          description: Login in successful
	 *        401:
	 *          description: Unauthorized
	 *        422:
	 *          description: Missing parameters
	 */
	public async LoginMethod(ctx: Context<IUser.LoginInDto>): Promise<IUser.LoginOutDto> {
		const user = await UserRepository.GetByName(ctx.params.name);

		// this is a mock authentication for the sake of the assessment
		// checkPassword would use the user's password hash as a second argument
		// currently: anyone can authenticate using the user name as password.
		const check = await AuthHelper.checkPassword(ctx.params.password, user.name);
		await Throw401(check, 'Invalid password');

		// this helper should also return a refreshToken
		// not implementing this feature since this API is using the remote API
		// as a user database and we couldn't attach a refreshToken to users.
		const { accessToken } = AuthHelper.generateToken(user);

		return {
			id: user.id,
			accessToken,
		};
	}

	@Action({
		params: {
			token: { type: 'string', min: 1, max: 256 },
		},
	})
	public async ResolveToken(
		ctx: Context<IUser.ResolveTokenInDto>,
	): Promise<IUser.ResolveTokenOutDto> {
		const response = await this.ResolveTokenMethod(ctx);
		return response;
	}

	@Method
	public async ResolveTokenMethod(
		ctx: Context<IUser.ResolveTokenInDto>,
	): Promise<IUser.ResolveTokenOutDto> {
		const { token } = ctx.params;
		const decoded: any = jwt.verify(token, AuthConfig.salt);
		if (decoded.iat) {
			const users = await fetch('https://www.mocky.io/v2/5808862710000087232b75ac').then(
				async res => {
					return res.ok ? res.json() : '';
				},
			);
			const user = users.clients.find((user: any) => user.name === decoded.data);
			return user;
		}
		return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN, ''));
	}

	@Action({
		params: {
			id: { type: 'string', optional: true, min: 36, max: 36 },
			name: { type: 'string', optional: true, min: 1, max: 64 },
		},
	})
	public async Read(ctx: Context<IUser.ReadInDto, { user: User }>): Promise<IUser.ReadOutDto> {
		const response = await this.ReadMethod(ctx);
		return response;
	}

	@Method
	/**
	 * @swagger
	 *
	 *  /user/:id:
	 *    post:
	 *      description: Get a user by ID
	 *      produces:
	 *        - application/json
	 *      consumes:
	 *        - application/json
	 *      parameters:
	 *        - in: path
	 *          name: id
	 *          schema:
	 *            type: string
	 *          required: true
	 *      responses:
	 *        200:
	 *          description: User found
	 *        404:
	 *          description: User not found
	 *        401:
	 *          description: Unauthorized
	 *        422:
	 *          description: Missing parameters
	 */
	public async ReadMethod(
		ctx: Context<IUser.ReadInDto, { user: User }>,
	): Promise<IUser.ReadOutDto> {
		const users = await fetch('https://www.mocky.io/v2/5808862710000087232b75ac').then(
			async res => {
				return res.ok ? res.json() : '';
			},
		);

		console.log(ctx.meta.user.role);

		const result = users.clients.find(
			(client: any) => client.id === ctx.params.id || client.name === ctx.params.name,
		);
		Throw404(result, 'No user was found');

		return result;
	}

	public async stopped() {
		return await getConnection().close();
	}
}

module.exports = UserService;
export default UserService;
