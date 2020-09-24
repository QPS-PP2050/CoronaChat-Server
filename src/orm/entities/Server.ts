import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Server {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    name: string | null = null;

    @Column("text")
    ownerID: string | null = null;

    @Column("text")
    users: string | null = null;

}
