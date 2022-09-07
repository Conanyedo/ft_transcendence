import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationService } from 'src/header/notification/notification.service';
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
		private notifService: NotificationService
	) { }

	async getRelation(user: string, friend: string) {
		const friendship: Friendship = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.user', 'friendships.friend', 'friendships.relation'])
			.where('(friendships.user = :user AND friendships.friend = :friend) OR (friendships.user = :friend AND friendships.friend = :user)', { user: user, friend: friend })
			.getOne();
		if (!friendship)
			return userRelation.NONE
		if (friendship.relation === userRelation.REQUESTED && user === friendship.user)
			return userRelation.PENDING;
		return friendship.relation;
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

	async getRequests(login: string) {
		const requests: Friendship[] = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.user'])
			.where('friendships.relation = :relation AND friendships.friend = :login', { relation: userRelation.REQUESTED, login: login })
			.getMany();
		if (!requests.length)
			return requests;
		const requestsList = await Promise.all(requests.map(async (friend) => {
			const requestInfo: friendDto = await this.userService.getFriend(friend.user);
			return requestInfo;
		}))
		return [...requestsList];
	}

	async getPending(login: string) {
		const pending: Friendship[] = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.friend'])
			.where('friendships.relation = :relation AND friendships.user = :login', { relation: userRelation.REQUESTED, login: login })
			.getMany();
		if (!pending.length)
			return pending;
		const pendingList = await Promise.all(pending.map(async (friend) => {
			const pendingInfo: friendDto = await this.userService.getFriend(friend.friend);
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
			const blockedInfo: friendDto = await this.userService.getFriend(friend.friend);
			return blockedInfo;
		}))
		return [...blockedList];
	}

	async addFriend(user: string, friend: string) {
		const friendship: Friendship = new Friendship();
		friendship.user = user;
		friendship.friend = friend;
		friendship.relation = userRelation.REQUESTED;
		this.friendshipRepository.save(friendship);
		this.notifService.addNotif(user, friend);
	}

	async unfriend(user: string, friend: string) {
		this.friendshipRepository
			.createQueryBuilder()
			.delete()
			.where('((friendships.user = :user AND friendships.friend = :friend) OR (friendships.user = :friend AND friendships.friend = :user)) AND friendships.relation = :relation', { user: user, friend: friend, relation: userRelation.FRIEND })
			.execute();
	}

	async acceptRequest(user: string, friend: string) {
		this.friendshipRepository
			.createQueryBuilder()
			.update({ relation: userRelation.FRIEND })
			.where('friendships.user = :friend AND friendships.friend = :user AND friendships.relation = :relation', { user: user, friend: friend, relation: userRelation.REQUESTED })
			.execute();
	}

	async refuseRequest(user: string, friend: string) {
		this.friendshipRepository
			.createQueryBuilder()
			.delete()
			.where('friendships.user = :friend AND friendships.friend = :user AND friendships.relation = :relation', { user: user, friend: friend, relation: userRelation.REQUESTED })
			.execute();
	}

	async cancelRequest(user: string, friend: string) {
		this.friendshipRepository
			.createQueryBuilder()
			.delete()
			.where('friendships.user = :user AND friendships.friend = :friend AND friendships.relation = :relation', { user: user, friend: friend, relation: userRelation.REQUESTED })
			.execute();
	}

	async blockUser(user: string, friend: string) {
		this.friendshipRepository
			.createQueryBuilder('friendships')
			.delete()
			.where('(friendships.user = :user OR friendships.user = :friend) AND (friendships.friend = :friend OR friendships.friend = :user)', { user: user, friend: friend })
			.execute();

		const friendship: Friendship = new Friendship();
		friendship.user = user;
		friendship.friend = friend;
		friendship.relation = userRelation.BLOCKED;
		this.friendshipRepository.save(friendship);

	}

	async unblock(user: string, friend: string) {
		this.friendshipRepository
			.createQueryBuilder()
			.delete()
			.where('friendships.user = :user AND friendships.friend = :friend AND friendships.relation = :relation', { user: user, friend: friend, relation: userRelation.BLOCKED })
			.execute();
	}
}
