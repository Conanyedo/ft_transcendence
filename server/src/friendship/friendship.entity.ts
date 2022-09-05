import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum userRelation {
	NONE = 'none',
	FRIEND = 'friend',
	PENDING = 'pending',
	BLOCKED = 'blocked'
}

@Entity({ name: 'friendships' })
export class Friendship {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	user: string;

	@Column()
	friend: string;

	@Column({ type: 'enum', enum: userRelation, default: userRelation.NONE })
	relation: userRelation;

}
