import Hapi from 'hapi';
import Joi from 'joi';

const customJoi = Joi.extend((joi: any) => ({
	base: joi.string(),
	name: 'string',
	language: {
		'required': '"{{label}}" is required',
		'length': '"{{label}}" must be of length 13',
		'onlyNumbers': '"{{label}}" must contain only numbers'
	},
	rules: [
		<any>{
			name: 'kladrId',
			validate(params: any, value: string, state: any, options: any) {
				if (!value) {
					return this.createError('string.required', { v: value }, state, options);
				}

				if (value.length !== 13) {
					return this.createError('string.length', { v: value }, state, options);
				}

				if (!value.match(/^[0-9]+$/)) {
					return this.createError('string.onlyNumbers', { v: value }, state, options);
				}

				return value;
			}
		}
	]
}));

const routes = [
	{
		config: {
			validate: {
				params: {
					kladrId: customJoi.string().kladrId()
				}
			}
		},
		method: 'get',
		path: '/city_addresses/{kladrId}',
		handler: async (request: any, hapi: Hapi.ResponseToolkit) =>
			request.hemera.act({
				topic: 'address',
				cmd: 'get-city-address-by-id',
				id: request.params.kladrId
			})
	}
];

module.exports = routes;
