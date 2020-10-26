// import {Entity, Column} from "typeorm";
import { Structure } from './Structure';

// @Entity()
export class Message extends Structure {

	// @Column("text")
	public content: string | null = null;

	// @Column("text")
	public userID: string | null = null;

	// @Column("text")
	public channelID: string | null = null;

}
