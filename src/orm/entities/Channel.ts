import {Entity, Column, ManyToOne} from "typeorm";
import { Structure } from "./Structure";
import { Server } from "./Server";

@Entity()
export class Channel extends Structure {

    @Column("text")
    name: string | null = null;

    @ManyToOne(type => Server, server => server.channels)
    server!: Server;

}
