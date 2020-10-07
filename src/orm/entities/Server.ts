import {Entity, Column, OneToMany, OneToOne, JoinColumn} from "typeorm";
import { Structure } from "./Structure";
import { Channel } from "./Channel";
import { User } from "./User";
import { Member } from "./Member";

@Entity()
export class Server extends Structure {

    @Column("text")
    name: string | null = null;

    @OneToOne(type => User)
    @JoinColumn()
    owner!: User;

    @OneToMany(type => Member, member => member.server)
    members!: Member[];

    @OneToMany(type => Channel, channel => channel.server)
    channels!: Channel[];
}
