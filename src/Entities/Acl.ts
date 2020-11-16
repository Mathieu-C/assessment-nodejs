import { AccessControl } from 'role-acl';

// grant list will eventually be fetched from a database:
const grantList = [
	// Admin
	// Can do any action on any ressource
	{ role: 'admin', resource: '*', action: '*', attributes: ['*'] },

	// User
	// Allow read on user (own user id only)
	{
		role: 'user',
		resource: 'user',
		action: 'read',
		attributes: ['id', 'name'],
		condition: {
			Fn: 'OR',
			args: [
				{
					Fn: 'EQUALS',
					args: {
						id: '$.requester',
					},
				},
				{
					Fn: 'EQUALS',
					args: {
						name: '$.requesterName',
					},
				},
			],
		},
	},
];
export const Acl = new AccessControl(grantList);
