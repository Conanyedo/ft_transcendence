import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum userRelation {
	NONE = 'none',
	FRIEND = 'friend',
	REQUESTED = 'requested',
	BLOCKED = 'blocked',
	PENDING = 'pending',
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
