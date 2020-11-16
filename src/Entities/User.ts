import { role } from '@Interfaces/Services/User/IUser';

export interface User {
	email: string;
	id: string;
	name: string;
	role: role;
}
