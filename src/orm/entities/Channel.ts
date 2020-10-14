import {Entity, Column, ManyToOne} from "typeorm";
import { Structure } from "./Structure";
import { Server } from "./Server";
import { ChannelType } from "@utils/Constants";

@Entity()
export class Channel extends Structure {

    @Column("text")
    type!: ChannelType

    @Column("text")
    name!: string;

    @ManyToOne(type => Server, server => server.channels)
    server!: Server;

}