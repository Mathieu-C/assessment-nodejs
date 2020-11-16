/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@Entities';
import { Acl } from '@Entities/Acl';
import { Context } from 'moleculer';

export class AclHelper {
	async checkPermission(
		entity: string,
		action: string,
		ctx: Context<any, { user: User }>,
		aclArgs: any,
	): Promise<boolean> {
		const permission = await Acl.can(ctx.meta.user.role)
			.context({
				requester: ctx.meta.user.id,
				requesterName: ctx.meta.user.name,
				...aclArgs,
			})
			.execute(action)
			.on(entity);

		if (!permission.granted) {
			console.log(
				`[ACL] user ${ctx.meta.user.name} (${ctx.meta.user.role}) NOT ALLOWED to ${action} ${entity}`,
			);
			return false;
		}

		console.log(
			`[ACL] user ${ctx.meta.user.name} (${ctx.meta.user.role}) ALLOWED to ${action} ${entity}`,
		);
		return true;
	}
}
