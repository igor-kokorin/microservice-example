import * as Hemera from 'nats-hemera';

export class AddressActions {
	constructor(
		private hemera: Hemera<Hemera.ServerRequest, Hemera.ServerResponse>,
		private joi: any,
		private addressService: IAddressService
	) {
		// Empty constructor
	}

	public registerActions() {
		const addressService = this.addressService;

		this.hemera.add(
			{
				topic: 'address',
				cmd: 'get-city-address-by-id',
				id: this.joi.string().required(),
				postJoi$: this.joi.object(
					{
						/* tslint:disable-next-line:no-null-keyword */
						country_iso_code: this.joi.string().allow(null, ''),
						/* tslint:disable-next-line:no-null-keyword */
						region: this.joi.string().allow(null, ''),
						/* tslint:disable-next-line:no-null-keyword */
						region_kladr_id: this.joi.string().allow(null, ''),
						/* tslint:disable-next-line:no-null-keyword */
						region_iso_code: this.joi.string().allow(null, ''),
						/* tslint:disable-next-line:no-null-keyword */
						region_fias_id: this.joi.string().allow(null, '')
					}
				)
			},
			async function (
				this: Hemera<Hemera.ServerRequest, Hemera.ServerResponse>,
				request: Hemera.ServerPattern
			): Promise<any> {
				return addressService.getCityAddressById(request.id);
			}
		);
	}
}
