import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { friendDto } from './friendship.dto';
import { Friendship, userRelation } from './friendship.entity';

@Injectable()
export class FriendshipService {
	constructor(
		@InjectRepository(Friendship)
		private friendshipRepository: Repository<Friendship>,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) { }

	async getRelation(user: string, friend: string) {
		const friendship: Friendship = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.relation'])
			.where('(friendships.user = :user AND friendships.friend = :friend) OR (friendships.user = :friend AND friendships.friend = :user)', { user: user, friend: friend })
			.getOne();
		return friendship ? friendship.relation : userRelation.NONE;
	}

	async getFriends(login: string) {
		const friends: Friendship[] = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.user', 'friendships.friend'])
			.where('friendships.relation = :relation AND (friendships.user = :login OR friendships.friend = :login)', { relation: userRelation.FRIEND, login: login })
			.getMany();
		if (!friends.length)
			return friends;
		const friendList = await Promise.all(friends.map(async (friend) => {
			const friendLogin = (friend.user === login) ? friend.friend : friend.user;
			const friendInfo: friendDto = await this.userService.getFriend(friendLogin);
			return friendInfo;
		}))
		return [...friendList];
	}

	async getPendings(login: string) {
		const pendings: Friendship[] = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.user'])
			.where('friendships.relation = :relation AND friendships.friend = :login', { relation: userRelation.PENDING, login: login })
			.getMany();
		if (!pendings.length)
			return pendings;
		const pendingList = await Promise.all(pendings.map(async (friend) => {
			const pendingInfo: friendDto = await this.userService.getPending(friend.user);
			return pendingInfo;
		}))
		return [...pendingList];
	}

	async getBlocked(login: string) {
		const blocked: Friendship[] = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.friend'])
			.where('friendships.relation = :relation AND friendships.user = :login', { relation: userRelation.BLOCKED, login: login })
			.getMany();
		if (!blocked.length)
			return blocked;
		const blockedList = await Promise.all(blocked.map(async (friend) => {
			const blockedInfo: friendDto = await this.userService.getPending(friend.friend);
			return blockedInfo;
		}))
		return [...blockedList];
	}

	async addFriend(user: string, friend: string) {
		const friendship: Friendship = new Friendship();
		friendship.user = user;
		friendship.friend = friend;
		friendship.relation = userRelation.PENDING;
		this.friendshipRepository.save(friendship);
	}

	async removeFriend(user: string, friend: string, relation: userRelation) {
		this.friendshipRepository
			.createQueryBuilder()
			.delete()
			.where('(friendships.user = :user OR friendships.user = :friend) AND (friendships.friend = :friend OR friendships.friend = :user) AND friendships.relation = :relation', { user: user, friend: friend, relation: relation })
			.execute();
	}
}
