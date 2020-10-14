import { DEV, PGSQL_DATABASE_HOST, PGSQL_DATABASE_NAME, PGSQL_DATABASE_PASSWORD, PGSQL_DATABASE_PORT, PGSQL_DATABASE_USER } from '@root/config';
import { ConnectionOptions, Connection, getConnection, createConnection } from 'typeorm';
import { join } from 'path';

export const config: ConnectionOptions = {
    type: "postgres",
    host: PGSQL_DATABASE_HOST,
    port: PGSQL_DATABASE_PORT,
    username: PGSQL_DATABASE_USER,
    password: PGSQL_DATABASE_PASSWORD,
    database: PGSQL_DATABASE_NAME,
    synchronize: DEV,
    logging: DEV,
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
        entitiesDir: "src/orm/entity",
        migrationsDir: "src/orm/migration",
        subscribersDir: "src/orm/subscriber"
    }
}

export const connect = (): Promise<Connection> => {
    try {
        return Promise.resolve(getConnection());
    } catch {
        return createConnection(config);
    }
};
