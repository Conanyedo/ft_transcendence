import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'conversations' })
export class Conversation {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	sender: string;

	@Column()
	receiver: string;

	@UpdateDateColumn()
	lastUpdate: Date;

	@OneToMany(() => Message, (message) => message.conversation)
	messages: Message[];
}

@Entity({ name: 'messages' })
export class Message {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	sender: string;

	@Column({ type: 'text' })
	msg: string;

	@CreateDateColumn()
	createDate: Date;

	@ManyToOne(() => Conversation, (conversation) => conversation.messages)
	conversation: Conversation;
}

