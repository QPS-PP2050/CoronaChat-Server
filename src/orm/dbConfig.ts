import { ConnectionOptions, Connection, getConnection, createConnection } from 'typeorm';
import { join } from 'path';
import dotEnvExtended from 'dotenv-extended';
import * as dotenvParseVariables from 'dotenv-parse-variables';
// const dotenvParseVariables = require('dotenv-parse-variables');

interface EnvConfig {
    DATABASE_HOST: string;
    DATABASE_PORT: number;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    DEV: boolean;
}

const envConfig: EnvConfig = dotenvParseVariables(dotEnvExtended.load()) as any;

export const config: ConnectionOptions = {
	type: 'postgres',
	host: envConfig.DATABASE_HOST,
	port: envConfig.DATABASE_PORT,
	username: envConfig.DATABASE_USER,
	password: envConfig.DATABASE_PASSWORD,
	database: envConfig.DATABASE_NAME,
	synchronize: envConfig.DEV,
	logging: envConfig.DEV,
	entities: [
		join(__dirname, 'entities/*.js')
	],
	migrations: [
		join(__dirname, 'migrations/*.js')
	],
	subscribers: [
		join(__dirname, 'subscriber/*.js')
	],
	cli: {
		entitiesDir: 'src/orm/entities',
		migrationsDir: 'src/orm/migrations',
		subscribersDir: 'src/orm/subscriber'
	}
};

export const connect = (): Promise<Connection> => {
	try {
		return Promise.resolve(getConnection());
	} catch {
		return createConnection(config);
	}
};
