import { Errors } from 'moleculer';

export const Throw401 = async (resource: boolean, message: string) => {
	if (!resource) {
		throw new Errors.MoleculerError(message, 401, 'Unauthorized access');
	}
	return resource;
};
