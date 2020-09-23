import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import type { User } from "./User";

@Entity()
export class Server {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    name: string | null = null;

    @Column("text")
    ownerID: string | null = null;

    @Column()
    users: User["id"][] | null = null;

}
