import "reflect-metadata";

import { HttpServer } from './http';
import { ChatServer } from './ws';
import { Api } from './api';

const http = new HttpServer();

new ChatServer(http.server);
new Api(http.app);

// Example Code for how to work with TypeORM
import { connect } from './orm/dbConfig';
import {User} from "./orm/entities/User";

connect().then(async connection => {

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.username = "test";
    user.password = "test";
    user.email = "test";
    user.salt = "test";
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
