import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatService } from 'src/chat/chat.service';
import { notifStatus } from 'src/header/notification/notification.entity';
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
		@Inject(forwardRef(() => ChatService))
		private readonly chatService: ChatService,
		@Inject(forwardRef(() => NotificationService))
		private readonly notifService: NotificationService
	) { }

	async getRelation(user: string, friend: string) {
		const friendship: Friendship = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.user', 'friendships.friend', 'friendships.relation'])
			.where('(friendships.user = :user AND friendships.friend = :friend) OR (friendships.user = :friend AND friendships.friend = :user)', { user: user, friend: friend })
			.getOne();
		if (!friendship)
			return userRelation.NONE;
		if (friendship.relation === userRelation.REQUESTED && user === friendship.user)
			return userRelation.PENDING;
		return friendship.relation;
	}

	async getOnlineFriends(login: string) {
		const friends: Friendship[] = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.user', 'friendships.friend'])
			.where('friendships.relation = :relation AND (friendships.user = :login OR friendships.friend = :login)', { relation: userRelation.FRIEND, login: login })
			.getMany();
		if (!friends.length)
			return { data: friends };
		const friendList = [];
		await Promise.all(friends.map(async (friend) => {
			const friendLogin = (friend.user === login) ? friend.friend : friend.user;
			const friendInfo: friendDto = await this.userService.getFriend(friendLogin);
			if (friendInfo.status === 'Online')
				friendList.push(friendInfo);
		}))
		return { data: [...friendList] };
	}

	async getFriends(login: string) {
		const friends: Friendship[] = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.user', 'friendships.friend'])
			.where('friendships.relation = :relation AND (friendships.user = :login OR friendships.friend = :login)', { relation: userRelation.FRIEND, login: login })
			.getMany();
		if (!friends.length)
			return { data: friends };
		const friendList = await Promise.all(friends.map(async (friend) => {
			const friendLogin = (friend.user === login) ? friend.friend : friend.user;
			const friendInfo: friendDto = await this.userService.getFriend(friendLogin);
			return friendInfo;
		}))
		return { data: [...friendList] };
	}

	async getRequests(login: string) {
		const requests: Friendship[] = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.user'])
			.where('friendships.relation = :relation AND friendships.friend = :login', { relation: userRelation.REQUESTED, login: login })
			.getMany();
		if (!requests.length)
			return { data: requests };
		const requestsList = await Promise.all(requests.map(async (friend) => {
			const requestInfo: friendDto = await this.userService.getFriend(friend.user);
			return requestInfo;
		}))
		return { data: [...requestsList] };
	}

	async getPending(login: string) {
		const pending: Friendship[] = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.friend'])
			.where('friendships.relation = :relation AND friendships.user = :login', { relation: userRelation.REQUESTED, login: login })
			.getMany();
		if (!pending.length)
			return { data: pending };
		const pendingList = await Promise.all(pending.map(async (friend) => {
			const pendingInfo: friendDto = await this.userService.getFriend(friend.friend);
			return pendingInfo;
		}))
		return { data: [...pendingList] };
	}

	async getBlocked(login: string) {
		const blocked: Friendship[] = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.select(['friendships.friend'])
			.where('friendships.relation = :relation AND friendships.user = :login', { relation: userRelation.BLOCKED, login: login })
			.getMany();
		if (!blocked.length)
			return { data: blocked };
		const blockedList = await Promise.all(blocked.map(async (friend) => {
			const blockedInfo: friendDto = await this.userService.getFriend(friend.friend);
			return blockedInfo;
		}))
		return { data: [...blockedList] };
	}

	async addFriend(user: string, friend: string) {
		const exist: Friendship = await this.friendshipRepository
			.createQueryBuilder('friendships')
			.where(`((friendships.user = '${user}' AND friendships.friend = '${friend}') OR (friendships.user = '${friend}' AND friendships.friend = '${user}')) AND friendships.relation = '${userRelation.FRIEND}'`)
			.getOne();
		if (exist)
			return { err: 'Friendship already exist' };
		const friendship: Friendship = new Friendship();
		friendship.user = user;
		friendship.friend = friend;
		friendship.relation = userRelation.REQUESTED;
		await this.friendshipRepository.save(friendship);
		return { data: true };
	}

	async unfriend(user: string, friend: string) {
		this.friendshipRepository
			.createQueryBuilder()
			.delete()
			.where('((friendships.user = :user AND friendships.friend = :friend) OR (friendships.user = :friend AND friendships.friend = :user)) AND friendships.relation = :relation', { user: user, friend: friend, relation: userRelation.FRIEND })
			.execute();
	}

	async acceptRequest(user: string, friend: string) {
		await this.friendshipRepository
			.createQueryBuilder()
			.update({ relation: userRelation.FRIEND })
			.where('friendships.user = :friend AND friendships.friend = :user AND friendships.relation = :relation', { user: user, friend: friend, relation: userRelation.REQUESTED })
			.execute();
		await this.notifService.updateNotif(friend, user, notifStatus.ACCEPTED);
		return true;
	}

	async refuseRequest(user: string, friend: string) {
		await this.friendshipRepository
			.createQueryBuilder()
			.delete()
			.where('friendships.user = :friend AND friendships.friend = :user AND friendships.relation = :relation', { user: user, friend: friend, relation: userRelation.REQUESTED })
			.execute();
		await this.notifService.updateNotif(friend, user, notifStatus.REFUSED);
		return true;
	}

	async cancelRequest(user: string, friend: string) {
		await this.friendshipRepository
			.createQueryBuilder()
			.delete()
			.where('friendships.user = :user AND friendships.friend = :friend AND friendships.relation = :relation', { user: user, friend: friend, relation: userRelation.REQUESTED })
			.execute();
		return true;
	}

	async blockUser(user: string, friend: string) {
		await this.friendshipRepository
			.createQueryBuilder('friendships')
			.delete()
			.where('(friendships.user = :user OR friendships.user = :friend) AND (friendships.friend = :friend OR friendships.friend = :user)', { user: user, friend: friend })
			.execute();

		const friendship: Friendship = new Friendship();
		friendship.user = user;
		friendship.friend = friend;
		friendship.relation = userRelation.BLOCKED;
		await this.friendshipRepository.save(friendship);
		await this.chatService.blockUser(user, friend);
		return true;
	}

	async unblock(user: string, friend: string) {
		await this.friendshipRepository
			.createQueryBuilder()
			.delete()
			.where('friendships.user = :user AND friendships.friend = :friend AND friendships.relation = :relation', { user: user, friend: friend, relation: userRelation.BLOCKED })
			.execute();
		await this.chatService.unBlockUser(user, friend);
		return true;
	}
}
