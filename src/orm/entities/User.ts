import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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

}
