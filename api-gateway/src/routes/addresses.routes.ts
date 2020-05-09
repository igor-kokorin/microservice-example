import Hapi from 'hapi';
import Joi from 'joi';

const routes = [
	{
		config: {
			validate: {
				params: {
					kladrId: Joi.string().length(13).required()
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
