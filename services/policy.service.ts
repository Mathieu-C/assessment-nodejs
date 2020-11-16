/* eslint-disable @typescript-eslint/no-explicit-any */
//#region Global Imports
import { Context, Service as MoleculerService } from 'moleculer';
import { Action, Method, Service } from 'moleculer-decorators';
import { getConnection } from 'typeorm';
//#endregion Global Imports

//#region Local Imports
import { User, Policy } from '@Entities';
import { Throw401, Throw404 } from '@Repositories/ErrorHelpers';
import { AclHelper } from '@ServiceHelpers';
import { PolicyRepository } from '@Repositories/Policy';
//#endregion Local Imports

//#region Interface Imports
import { IPolicy } from '@Interfaces/Services/Policy';
//#endregion Interface Imports

@Service({
	name: 'policies',
})
class PolicyService extends MoleculerService {
	public async started() {}

	@Action({
		params: {
			name: { type: 'string', min: 1, max: 64 },
		},
	})
	public async GetByUser(
		ctx: Context<IPolicy.GetByNameInDto, { user: User }>,
	): Promise<Policy[]> {
		const response = await this.GetByUserMethod(ctx);
		return response;
	}

	@Method
	/**
	 * @swagger
	 *
	 *  /api/policies/user/:name:
	 *    get:
	 *      description: Get all the policies for user name
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
	 *          description: Valid request
	 *        404:
	 *          description: User not found
	 *        401:
	 *          description: Unauthorized
	 *        422:
	 *          description: Missing parameters
	 */
	public async GetByUserMethod(
		ctx: Context<IPolicy.GetByNameInDto, { user: User }>,
	): Promise<Policy[]> {
		const acl = new AclHelper();

		const aclCheck = await acl.checkPermission('user', 'GetByName', ctx, {});
		Throw401(aclCheck);

		const policies = await PolicyRepository.GetByUserName(ctx.params.name);
		Throw404(policies, `No policy found for user ${ctx.params.name}`);

		return policies;
	}

	@Action({
		params: {
			id: { type: 'string', min: 1, max: 64 },
		},
	})
	public async GetUser(ctx: Context<IPolicy.GetUserInDto, { user: User }>): Promise<User> {
		const response = await this.GetUserMethod(ctx);
		return response;
	}

	@Method
	@Method
	/**
	 * @swagger
	 *
	 *  /api/policies/:id/user:
	 *    get:
	 *      description: Get the user linked to the policy number
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
	 *          description: Valid request
	 *        404:
	 *          description: Policy not found
	 *        401:
	 *          description: Unauthorized
	 *        422:
	 *          description: Missing parameters
	 */
	public async GetUserMethod(ctx: Context<IPolicy.GetUserInDto, { user: User }>): Promise<User> {
		const acl = new AclHelper();

		const aclCheck = await acl.checkPermission('user', 'GetUser', ctx, {});
		Throw401(aclCheck);

		const policies = await PolicyRepository.GetUser(ctx.params.id);
		Throw404(policies, `No policy found for user ${ctx.params.id}`);

		return policies;
	}

	public async stopped() {
		return await getConnection().close();
	}
}

module.exports = PolicyService;
export default PolicyService;
