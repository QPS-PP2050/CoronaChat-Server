import {Entity, Column, ManyToMany} from "typeorm";
import { Exclude } from 'class-transformer';
import { Server } from "./Server";
import { Structure } from "./Structure";

@Entity()
export class User extends Structure {

    @Column({
        type: "text",
        nullable: true
    })
    username: string | null = null;

    @Exclude()
    @Column("text")
    password: string | null = null;

    @Exclude()
    @Column("text")
    email: string | null = null;

    @ManyToMany(type => Server)
    servers!: Server[];
}
