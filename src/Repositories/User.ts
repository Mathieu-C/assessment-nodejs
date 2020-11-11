//#region Global Imports
import { User } from '@Entities';
import { Throw404 } from './ErrorHelpers';
import fetch from 'node-fetch';
//#endregion Global Imports

//#region Local Imports
import { getResource } from './Shared';
//#endregion Local Imports

//#region Interface Imports
//#endregion Interface Imports

export namespace UserRepository {
	export const Get = async (id: string): Promise<User> => {
		const users = await fetch('https://www.mocky.io/v2/5808862710000087232b75ac').then(
			async res => {
				return res.ok ? res.json() : '';
			},
		);

		const user = users.clients.find((client: User) => client.id === id);
		Throw404(user, 'No user was found');

		return user;
	};

	export const GetByName = async (name: string): Promise<User> => {
		const users = await fetch('https://www.mocky.io/v2/5808862710000087232b75ac').then(
			async res => {
				return res.ok ? res.json() : '';
			},
		);

		const user = users.clients.find((client: User) => client.name === name);
		Throw404(user, 'No user was found');

		return user;
	};
}
