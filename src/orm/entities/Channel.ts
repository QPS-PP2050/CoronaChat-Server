import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Channel {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    name: string | null = null;

    @Column("text")
    serverID: string | null = null;

}
