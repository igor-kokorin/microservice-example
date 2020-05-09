import Boom from 'boom';

export default class AddressService implements IAddressService {
	constructor(private dadataUtil: IDadataUtil) {

	}

	public async getCityAddressById(cityKladrId: string): Promise<any> {
		if (!cityKladrId) {
			throw new Error('You must provide cityKladrId');
		}

		const result = await this.dadataUtil.post('/suggestions/api/4_1/rs/findById/address', { query: cityKladrId });

		if (!result.suggestions || !Array.isArray(result.suggestions)) {
			throw new Error('dadata.ru API returned invalid data');
		}

		if (!result.suggestions.length) {
			throw Boom.notFound('City not found');
		}

		const data = result.suggestions[0].data;

		return {
			country_iso_code: data.country_iso_code,
			region: data.region,
			region_kladr_id: data.region_kladr_id,
			region_iso_code: data.region_iso_code,
			region_fias_id: data.region_fias_id
		};
	}
}
