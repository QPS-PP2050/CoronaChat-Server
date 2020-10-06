import {Entity, Column, ManyToMany, OneToMany, OneToOne, JoinColumn, JoinTable} from "typeorm";
import { Structure } from "./Structure";
import { Channel } from "./Channel";
import { User } from "./User";
// import { Member } from "./Member";

@Entity()
export class Server extends Structure {

    @Column("text")
    name: string | null = null;

    @OneToOne(type => User)
    @JoinColumn()
    owner!: User;

    @ManyToMany(type => User, user => user.servers)
    @JoinTable({
        name: "members",
        joinColumn: {
            name: 'server',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'user',
            referencedColumnName: 'id'
        }
        
    })
    members!: User[];

    @OneToMany(type => Channel, channel => channel.server)
    channels!: Channel[];
}
