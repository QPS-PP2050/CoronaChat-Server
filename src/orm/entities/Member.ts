import {Entity, OneToOne, JoinColumn, ManyToOne} from "typeorm";
import { Server } from "./Server";
import { User } from "./User";

@Entity()
export class Member {

    @OneToOne(type => User, user => user.id, {primary: true})
    @JoinColumn()
    user?: User;

    @ManyToOne(type => Server, server => server.members, {primary: true})
    server?: Server;
}
