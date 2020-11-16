//#region Global Imports
import { Throw404 } from './ErrorHelpers';
//#endregion Global Imports

//#region Local Imports
import { User, Policy } from '@Entities';
import { UserRepository } from './User';
import { FetchHelper } from '@ServiceHelpers/FetchHelper';
//#endregion Local Imports

export namespace PolicyRepository {
	const policyApi = 'https://www.mocky.io/v2/580891a4100000e8242b75c5';

	export const GetByUserName = async (name: string): Promise<Policy[]> => {
		const user = await UserRepository.GetByName(name);
		Throw404(user, `No user found with name ${name}`);

		const policies = await FetchHelper.getData(policyApi);

		const retPolicies = policies.policies.filter(
			(policy: Policy) => policy.clientId === user.id,
		);
		Throw404(retPolicies, `No policy found for user ${name}`);

		return retPolicies;
	};

	export const GetUser = async (id: string): Promise<User> => {
		const policies = await FetchHelper.getData(policyApi);

		const policy: Policy = policies.policies.find((policy: Policy) => policy.id === id);
		Throw404(policy, `No policy found with id ${id}`);

		const user: User = await UserRepository.Get(policy.clientId);
		Throw404(user, `No user found for policy ${policy.clientId}`);

		return user;
	};
}
