import 'module-alias/register';

import * as Blipp from 'blipp';
import Hapi from 'hapi';
import HapiHemera from 'hapi-hemera';
import * as path from 'path';

import * as config from '@environments';
import AppLogger from '@logger/app.logger';

async function init() {
	// Setup environment config
	config.init();

	const hapiHost: any = config.getServerConfig().API_HOST;
	const hapiPort: any = config.getServerConfig().API_PORT;

	// Create the Hapi server
	const server: Hapi.Server = new Hapi.Server({
		port: hapiPort,
		host: hapiHost,
		debug: { request: ['error'] },
		routes: {
			validate: {
				failAction: async (request: any, h: Hapi.ResponseToolkit, err: any) => {
					if (err.isBoom) {
						throw err
					}
				}
			}
		}
	});

	// Configure the logger
	const appLogger = new AppLogger();
	appLogger.setupAppLogger();

	// Register Hemera
	const hemeraLogLevel: any = config.getServerConfig().HEMERA_LOG_LEVEL;
	await server.register({
		plugin: HapiHemera,
		options: {
			hemera: {
				name: 'api-gateway',
				logLevel: hemeraLogLevel,
				childLogger: true,
				tag: 'hemera-api-gw-1'
			},
			nats: {
				url: config.getServerConfig().NATS_URL,
				user: config.getServerConfig().NATS_USER,
				pass: config.getServerConfig().NATS_PW
			}
		}
	});

	// Auto route discovery
	await server.register(
		{
			plugin: require('wurst'),
			options: {
				routes: '*.routes.js',
				cwd: path.join(__dirname, 'routes')
			}
		},
		{
			routes: {
				prefix: config.getServerConfig().ROUTE_PREFIX
			}
		}
	);

	// Route table console output
	await server.register(Blipp);

	// Enriched console output
	await server.register({
		plugin: require('good'),
		options: {
			reporters: {
				console: [
					{
						module: 'good-squeeze',
						name: 'Squeeze',
						args: [
							{
								log: '*',
								request: '*',
								response: '*',
								error: '*'
							}
						]
					},
					{
						module: 'good-console'
					},
					'stdout'
				]
			}
		}
	});

	server.ext('onPreResponse', (request: any, h: Hapi.ResponseToolkit) => {
		const response = request.response
		if (!response.isBoom) {
			return h.continue
		}

		const is4xx = response.output.statusCode >= 400 && response.output.statusCode < 500
		if (is4xx && response.data) {
			response.output.payload.data = response.data
		}

		return h.continue
	})

	await server.start();
	return server;
}

init()
	.then(server => {
		AppLogger.logger.debug(`Server running at: ${server.info.uri}`);
	})
	.catch(error => {
		AppLogger.logger.error(`Server failed: ${JSON.stringify(error)}`);
	});
