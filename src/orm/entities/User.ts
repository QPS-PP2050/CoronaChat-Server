import {Entity, PrimaryGeneratedColumn, Column, ManyToMany} from "typeorm";
import { Exclude } from 'class-transformer';
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

    @Exclude()
    @Column("text")
    password: string | null = null;

    @Exclude()
    @Column("text")
    email: string | null = null;

    @ManyToMany(type => Server)
    servers!: Server[];
}
