/* eslint-disable @typescript-eslint/no-explicit-any */
//#region Global Imports
import { Context, Service as MoleculerService } from 'moleculer';
import { Action, Method, Service } from 'moleculer-decorators';
import { getConnection } from 'typeorm';
import jwt from 'jsonwebtoken';
import { Errors as E } from 'moleculer-web';
//#endregion Global Imports

//#region Local Imports
import { AuthConfig } from '@Config';

//#endregion Local Imports

//#region Interface Imports
import { IUser } from '@Interfaces';
import { Throw401, Throw404 } from '@Repositories/ErrorHelpers';
import { AuthHelper } from '@ServiceHelpers/AuthHelper';
import { UserRepository } from '@Repositories';
import { User } from '@Entities';
import { AclHelper } from '@ServiceHelpers';
//#endregion Interface Imports

@Service({
	name: 'users',
})
class UserService extends MoleculerService {
	public async started() {}

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
	 *  /auth/users/login:
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
	 *                minimum: 1
	 *                maximum: 64
	 *                example: Mark
	 *              password:
	 *                type: string
	 *                minimum: 1
	 *                maximum: 64
	 *                example: alligator15
	 *      responses:
	 *        200:
	 *          description: Login in successful
	 *        401:
	 *          description: Unauthorized
	 *        404:
	 *          description: User not found
	 *        422:
	 *          description: Missing parameters
	 */
	public async LoginMethod(ctx: Context<IUser.LoginInDto>): Promise<IUser.LoginOutDto> {
		const user = await UserRepository.GetByName(ctx.params.name);

		// this is a mock authentication for the sake of the assessment
		// checkPassword would use the user's password hash as a second argument
		// currently: anyone can authenticate using the user name as password.
		const check = await AuthHelper.checkPassword(ctx.params.password, user.name);
		Throw401(check, 'Invalid password');

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
			const user = await UserRepository.GetByName(decoded.data);
			Throw404(user, 'User not found');
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
	public async Get(ctx: Context<IUser.GetInDto, { user: User }>): Promise<IUser.GetOutDto> {
		const response = await this.GetMethod(ctx);
		return response;
	}
	@Method
	/**
	 * @swagger
	 *
	 *  /api/users/:id:
	 *    get:
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
	public async GetMethod(ctx: Context<IUser.GetInDto, { user: User }>): Promise<IUser.GetOutDto> {
		const acl = new AclHelper();

		const aclCheck = await acl.checkPermission('user', 'read', ctx, {
			id: ctx.params.id,
		});
		Throw401(aclCheck);

		const user = await UserRepository.Get(ctx.params.id);
		Throw404(user, 'No user was found');

		return user;
	}

	@Action({
		params: {
			name: { type: 'string', optional: true, min: 1, max: 64 },
		},
	})
	public async GetByName(
		ctx: Context<IUser.GetByNameInDto, { user: User }>,
	): Promise<IUser.GetOutDto> {
		const response = await this.GetByNameMethod(ctx);
		return response;
	}
	@Method
	/**
	 * @swagger
	 *
	 *  /api/users/name/:name:
	 *    get:
	 *      description: Get a user by name
	 *      produces:
	 *        - application/json
	 *      consumes:
	 *        - application/json
	 *      parameters:
	 *        - in: path
	 *          name: name
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
	public async GetByNameMethod(
		ctx: Context<IUser.GetByNameInDto, { user: User }>,
	): Promise<IUser.GetOutDto> {
		const acl = new AclHelper();

		const aclCheck = await acl.checkPermission('user', 'read', ctx, {
			name: ctx.params.name,
		});
		Throw401(aclCheck);

		const user = await UserRepository.GetByName(ctx.params.name);
		Throw404(user, 'No user was found');

		return user;
	}

	public async stopped() {
		return await getConnection().close();
	}
}

module.exports = UserService;
export default UserService;
