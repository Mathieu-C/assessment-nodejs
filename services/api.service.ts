/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
//#region Global Imports
import { ServiceSchema } from 'moleculer';
import ApiGateway = require('moleculer-web');
import { Context } from 'vm';
import { Errors as E } from 'moleculer-web';
//#endregion Global Imports

const ApiService: ServiceSchema = {
	name: 'api',

	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 3000,

		routes: [
			{
				aliases: {
					'POST users/login': 'users.Login',
				},
				bodyParser: {
					json: true,
					urlencoded: { extended: false },
				},
				cors: {
					credentials: true,
					methods: ['POST', 'OPTIONS'],
					origin: ['*'],
				},
				path: '/auth',
				whitelist: ['users.Login'],
			},
			{
				aliases: {
					'GET users/:id': 'users.Read',
					'GET users/:name': 'users.Read',
					'GET users/:name/policy': 'policies.Read',
					'GET policies/:id/user': 'policies.Read',
				},
				authorization: true,
				bodyParser: {
					json: true,
					urlencoded: { extended: false },
				},
				cors: {
					authorization: true,
					credentials: true,
					methods: ['GET', 'OPTIONS'],
					origin: ['*'],
				},
				path: '/api',
				whitelist: ['users.Read', 'policies.Read'],
				// async onBeforeCall(ctx: Context, route: object, req: any) {
				// 	return new Promise(resolve => {
				// 		if (
				// 			req.headers['authorization'] &&
				// 			req.headers['authorization'].startsWith('Bearer')
				// 		) {
				// 			ctx.meta.authToken = req.headers.get('authorization')!.slice(7);
				// 		}

				// 		resolve();
				// 	});
				// },
			},
		],

		// Serve assets from 'public' folder
		assets: {
			folder: 'public',
		},
	},
	methods: {
		async authorize(ctx: Context, _route: any, req: any) {
			const auth = req.headers['authorization'];

			if (!auth || !auth.startsWith('Bearer')) {
				return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN, {}));
			}

			const token = auth.slice(7);
			if (!token) return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN, {}));

			try {
				return ctx.call('users.ResolveToken', { token }).then(async (user: any) => {
					ctx.meta.user = user;
					return Promise.resolve(user);
				});
			} catch (err) {
				console.log(err);
				return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN, {}));
			}
		},
	},
};

export = ApiService;
