import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import type { Server } from "./Server";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    username: string | null = null;

    @Column("text")
    password: string | null = null;

    @Column("text")
    email: string | null = null;

    @Column()
    servers: Server["id"][] | null = null;
}
