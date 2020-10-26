import { ConnectionOptions, Connection, getConnection, createConnection } from 'typeorm';
import { join } from 'path';

export const config: ConnectionOptions = {
    type: 'postgres',
	host: process.env.DATABASE_HOST,
	port: parseInt(process.env.DATABASE_PORT!, 10),
	username: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	synchronize: process.env.DEV as unknown as boolean,
	logging: process.env.DEV as unknown as boolean,
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
