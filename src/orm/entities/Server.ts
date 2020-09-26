import {Entity, Column, ManyToMany, OneToMany, JoinTable} from "typeorm";
import { Structure } from "./Structure";
import { Channel } from "./Channel";
import { User } from "./User";

@Entity()
export class Server extends Structure {

    @Column("text")
    name: string | null = null;

    @Column("text")
    ownerID: string | null = null;

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

    @OneToMany(type => Channel, channel => channel.serverID)
    channels!: Channel[];
}
