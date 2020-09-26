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

    @Column("text", {select: false})
    password: string | null = null;

    @Column("text", {select: false})
    email: string | null = null;

    @ManyToMany(type => Server)
    servers!: Server[];
}
