import 'module-alias/register';
import 'reflect-metadata';

import HemeraJoi from 'hemera-joi';
import * as Nats from 'nats';
import Hemera from 'nats-hemera';

import * as config from '@environments';
import AppLogger from '@logger/app.logger';
import AddressService from '@services/address.service';
import DadataUtil from '@utils/dadata.util';

import { AddressActions } from '@actions';

// Setup environment config
config.init();

const nats = Nats.connect({
	url: config.getServerConfig().NATS_URL,
	user: config.getServerConfig().NATS_USER,
	pass: config.getServerConfig().NATS_PW
});

const hemeraLogLevel: any = config.getServerConfig().HEMERA_LOG_LEVEL;
const hemera: any = new Hemera(nats, {
	logLevel: hemeraLogLevel,
	childLogger: true,
	tag: 'hemera-address'
});

async function init() {
	// Setup the logger
	const appLogger = new AppLogger();
	appLogger.setupAppLogger();

	AppLogger.logger.debug(`Address service config: ${JSON.stringify(config.getServerConfig())}`);
}

async function start() {
	await init();

	hemera.use(HemeraJoi);

	await hemera.ready(() => {
		const dadataUtil = new DadataUtil(config.getServerConfig().DADATA_TOKEN);

		const addressService = new AddressService(dadataUtil);

		// Register service actions
		const addressActions = new AddressActions(hemera, hemera.joi, addressService);
		addressActions.registerActions();

		AppLogger.logger.debug('Address service listening...');
	});
}

start();
