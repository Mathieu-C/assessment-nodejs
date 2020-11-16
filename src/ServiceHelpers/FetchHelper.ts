import fetch from 'node-fetch';

export class FetchHelper {
	static async getData(target: string) {
		return await fetch(target)
			.then(async res => {
				if (res.ok) return res.json();
				console.log(res);
				throw new Error('Internal error');
			})
			.catch(err => {
				console.log(err);
				throw new Error('Internal error');
			});
	}
}
