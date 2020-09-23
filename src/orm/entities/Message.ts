import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    content: string | null = null;

    @Column("text")
    userID: string | null = null;

    @Column("text")
    channelID: string | null = null;

}
