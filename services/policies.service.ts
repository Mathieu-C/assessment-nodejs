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
//#endregion Interface Imports

@Service({
	name: 'policies',
})
class PolicyService extends MoleculerService {
	public async started() {
		return await connectionInstance();
	}

	public async stopped() {
		return await getConnection().close();
	}
}

module.exports = PolicyService;
export default PolicyService;
