import {Entity, Column, ManyToMany} from "typeorm";
import { Exclude } from 'class-transformer';
import { Structure } from "./Structure";
import { Server } from './Server';

@Entity()
export class User extends Structure {

    @Column({
        type: "text"
    })
    username!: string;

    @Exclude()
    @Column("text")
    password!: string;

    @Exclude()
    @Column("text")
    email!: string;

    @ManyToMany(type => Server, server => server.members, { onDelete: 'CASCADE' })
    servers?: Server[];
}
