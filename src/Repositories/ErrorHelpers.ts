//#region Global Imports
import { Errors } from 'moleculer';
//#endregion Global Imports

export const Throw401 = (granted: boolean, message?: string) => {
	if (!granted) {
		throw new Errors.MoleculerError(message || '', 401, 'Unauthorized access');
	}
	return granted;
};

export const Throw404 = <R extends {}>(resource: R | undefined, message: string): R => {
	if (!resource) {
		throw new Errors.MoleculerError(message, 404, 'Not Found');
	}
	return resource;
};
