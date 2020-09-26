import {PrimaryGeneratedColumn} from "typeorm";

export abstract class Structure {
    @PrimaryGeneratedColumn()
    id!: number;
}