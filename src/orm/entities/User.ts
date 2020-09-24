import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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

    @Column({
        type: "text",
        nullable: true
    })
    servers: string | null = null;
}
