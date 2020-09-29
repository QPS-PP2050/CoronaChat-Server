import {PrimaryColumn} from "typeorm";

export abstract class Structure {
    @PrimaryColumn("text")
    id!: string;
}