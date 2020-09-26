import {Entity, PrimaryGeneratedColumn, Column, ManyToMany} from "typeorm";
import { Server } from "./Server";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "text",
        nullable: true
    })
    username: string | null = null;

    @Column("text")
    password: string | null = null;

    @Column("text")
    email: string | null = null;

    @ManyToMany(type => Server)
    servers!: Server[];
}
