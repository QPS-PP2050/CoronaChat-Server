import "reflect-metadata";

import { HttpServer } from './http';
import { ChatServer } from './ws';
import { Api } from './api';

const http = new HttpServer();

new ChatServer(http.server);
new Api(http.app);

import { connect } from './orm/dbConfig';
import {User} from "./orm/entities/User";
import { getConnection } from "typeorm";

connect().then(async connection => {

    await getConnection()
        .createQueryBuilder()
        .delete()
        .from(User)
        .execute();

    console.log("Inserting a new user into the database....");
    const user = new User();
    user.id = 1;
    user.username = "louis-manabat";
    user.password = "testing123";
    user.email = "louis@hotmail.com";
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);


    console.log("Loading latest user from the database...");
    const latestUser = await connection
        .createQueryBuilder()
        .select("user")
        .from(User, "user")
        .orderBy("user.id", "DESC")
        .limit(1)
        .getOne();

    console.log("Newest user: ", latestUser);
    
    console.log("Adding new user: ");
    const user2 = new User();
    user2.id = 1;
    user2.username = "louis-manabata";
    user2.password = "testing1233";
    user2.email = "louis@hotmail.com";
    await connection.manager.save(user2);
    console.log("Saved a new user with id: " + user2.id);
    

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));