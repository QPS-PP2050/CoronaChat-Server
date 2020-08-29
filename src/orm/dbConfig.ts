import { ConnectionOptions, Connection, getConnection, createConnection } from 'typeorm';
import { join } from 'path';

export const config: ConnectionOptions = {
   type: "postgres",
   host: "localhost",
   port: 5432,
   username: "gitpod",
   password: "postgresdev",
   database: "postgres",
   synchronize: true,
   logging: false,
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
