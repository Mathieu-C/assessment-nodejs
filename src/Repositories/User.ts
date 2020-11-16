//#region Global Imports
import { User } from '@Entities';
import { Throw404 } from './ErrorHelpers';
import { FetchHelper } from '@ServiceHelpers/FetchHelper';
//#endregion Global Imports

//#region Local Imports
// import { getResource } from './Shared';
//#endregion Local Imports

//#region Interface Imports
//#endregion Interface Imports

export namespace UserRepository {
	const userApi = 'https://www.mocky.io/v2/5808862710000087232b75ac';

	export const Get = async (id: string): Promise<User> => {
		const users = await FetchHelper.getData(userApi);

		const user = users.clients.find((client: User) => client.id === id);
		Throw404(user, `No user found with id ${id}`);

		return user;
	};

	export const GetByName = async (name: string): Promise<User> => {
		const users = await FetchHelper.getData(userApi);

		const user = users.clients.find((client: User) => client.name === name);
		Throw404(user, `User ${name} not found`);

		return user;
	};
}
