import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username: string | null = null;

    @Column()
    password: string | null = null;

    @Column()
    email: string | null = null;

    @Column()
    salt: string | null = null;

}
