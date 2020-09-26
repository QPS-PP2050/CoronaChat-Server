import {Entity, Column, ManyToMany, OneToMany, JoinTable, OneToOne, JoinColumn} from "typeorm";
import { Structure } from "./Structure";
import { Channel } from "./Channel";
import { User } from "./User";

@Entity()
export class Server extends Structure {

    @Column("text")
    name: string | null = null;

    @OneToOne(type => User, {eager: true})
    @JoinColumn()
    owner!: User;

    @ManyToMany(type => User)
    @JoinTable({
        name: "server_members",
        joinColumn: {
            name: "user",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "server",
            referencedColumnName: "id"
        }
    })
    users!: User[];

    @OneToMany(type => Channel, channel => channel.server, {eager: true})
    channels!: Channel[];
}
