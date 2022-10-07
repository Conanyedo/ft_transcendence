import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export enum memberStatus {
	OWNER = "Owner",
	ADMIN = "Admin",
	MEMBER = "Member",
	MUTED = "Muted",
	LEFT = "Left",
	BANNED = "Banned",
	BLOCKER = "Blocker"
}

export enum convType {
	DM = "Dm",
	PUBLIC = "Public",
	PROTECTED = "Protected",
	PRIVATE = "Private",
}

export enum invStatus {
	SENT = "Sent",
	CANCELED = "Canceled",
	ACCEPTED = "Accepted",
	REFUSED = "Refused",
}

@Entity({ name: 'conversations' })
export class Conversation {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ default: null })
	name: string;

	@UpdateDateColumn()
	lastUpdate: Date;

	@Column({ type: 'enum', enum: convType, default: convType.DM })
	type: convType;

	@Column({ default: null })
	password: string;

	@Column({ default: null })
	avatar: string;

	@OneToMany(() => Message, (message) => message.conversation)
	messages: Message[];

	@OneToMany(() => Member, (member) => member.conversation)
	members: Member[];
}

@Entity({ name: 'messages' })
export class Message {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	sender: string;

	@Column({ type: 'text', nullable: true })
	msg: string;

	@Column({ default: null })
	invitation: string;

	@Column({ type: 'enum', enum: invStatus, default: invStatus.SENT })
	status: invStatus;

	@CreateDateColumn()
	createDate: Date;

	@ManyToOne(() => Conversation, (conversation) => conversation.messages)
	conversation: Conversation;
}

@Entity({ name: 'members' })
export class Member {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: 'enum', enum: memberStatus, default: memberStatus.MEMBER })
	status: memberStatus;

	@CreateDateColumn()
	joinDate: Date;

	@Column({ default: null })
	leftDate: Date;

	@ManyToOne(() => Conversation, (conversation) => conversation.members)
	conversation: Conversation;

	@ManyToOne(() => User, (user) => user.members)
	user: User;
}

