import { ConnectionOptions, Connection, getConnection, createConnection } from 'typeorm';
import { join } from 'path';

const prodConfig: ConnectionOptions = { 
   type: "postgres",
   host: "localhost",
   port: 5432,
   username: "coronachat",
   password: "coronachat",
   database: "coronachat-prod",
   synchronize: false,
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

const devConfig: ConnectionOptions = { 
   type: "postgres",
   host: "coronachat.xyz",
   port: 5432,
   username: "coronachat",
   password: "coronachat",
   database: "coronachat-test",
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
		return createConnection(process.env.NODE_ENV === 'production' ? prodConfig : devConfig);
	}
};
