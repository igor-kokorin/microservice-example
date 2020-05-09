import https from 'https';

export default class DadataUtil implements IDadataUtil {
	private dadataHost: string;
	private dadataToken: string;
	constructor(dadataToken: string) {
		if (!dadataToken) {
			throw new Error('You must provide dadataToken');
		}

		this.dadataToken = dadataToken;
		this.dadataHost = 'suggestions.dadata.ru';
	}

	public async post(dadataMethod: string, requestBody: GetAddressRequestBody): Promise<any> {
		if (!dadataMethod) {
			throw new Error('You must provide dadataMethod');
		}

		if (!requestBody) {
			throw new Error('You must provide requestBody');
		}

		return new Promise((resolve, reject) => {
			const method = 'POST';

			const request = https.request({
				hostname: this.dadataHost,
				path: dadataMethod,
				agent: false,
				method,
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': `Token ${this.dadataToken}`
				}
			}, (res) => {
				if (res.statusCode !== 200) {
					reject(new Error(`Cannot get response from dadata.ru API - status code ${res.statusCode}`));
					return;
				}

				res.on('data', data => {
					if (!data) {
						reject(new Error('No data was returned from dadata.ru API'));
						return;
					}

					let result = data.toString();

					result = JSON.parse(result);

					resolve(result);
				});
			});

			request.on('error', error => {
				reject(error);
			});

			request.end(JSON.stringify(requestBody));
		});
	}
}
