// import {Entity, Column} from "typeorm";
import { Structure } from "./Structure";

// @Entity()
export class Message extends Structure {

    // @Column("text")
    content: string | null = null;

    // @Column("text")
    userID: string | null = null;

    // @Column("text")
    channelID: string | null = null;

}
