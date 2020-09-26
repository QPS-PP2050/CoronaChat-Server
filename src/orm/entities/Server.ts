import {Entity, Column, ManyToMany, OneToMany, JoinTable, OneToOne, JoinColumn} from "typeorm";
import { Structure } from "./Structure";
import { Channel } from "./Channel";
import { User } from "./User";

@Entity()
export class Server extends Structure {

    @Column("text")
    name: string | null = null;

    @OneToOne(type => User)
    @JoinColumn()
    owner!: User;

    @ManyToMany(type => User)
    @JoinTable()
    users!: User[];

    @OneToMany(type => Channel, channel => channel.server)
    channels!: Channel[];
}
