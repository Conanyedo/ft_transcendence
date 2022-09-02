<<<<<<< HEAD
import { StaticImageData } from "next/image"
=======
import internal from "stream";

class Stats {
	XP: number = 0;
	GP: number = 0;
	rank: number = 0;
}


export class UserTypeNew {
	id: number = 0;
	login: string = '';
	avatar: string = '';
	fullname: string = '';
	stats: Stats = new Stats();
	XP: number = 0;
	GP: number = 0;
	rank: number = 0;
	numGames: number = 0;
	gamesWon: number = 0;
	achievement: number[] = [];
	status: string = '';
};

export const EmtyUser : UserTypeNew = {
	id: 0,
	login: '',
	avatar: '',
	fullname: '',
	stats: new Stats(),
	XP: 0,
	GP: 0,
	rank: 0,
	numGames: 0,
	gamesWon: 0,
	achievement: [],
	status: '',
}
>>>>>>> ec57b4511ce3c20a6eafdadf6f46b9dd096537c0

export interface UserType {
	id: number,
	avatar: string;
	fullName: string;
	lvl: number;
	GamePoint: number;
	Rank: number;
	Tier: string;
	games: number;
	wins: number;
	me: boolean;
	friendsID: number[];
	friendsPending: number[],
	BlockList: number[],
	friendsRequast: number[],
	stat: string,
	RankPos: number,
};

<<<<<<< HEAD
export interface chatUser {
	id: number;
	imgSrc: StaticImageData;
	fullName?: string;
	channelName?: string;
	status: string
  }

export interface chatMsg {
	msgContent: string | JSX.Element, 
	time: string, 
	type: string, 
	name: string
}

export interface color {
	color: string
=======
export interface matchDataType {
	id: number,
	badge: number;
	fullName: string;
	games: number;
	Win: number;
	lvlP: number;
	avatar: string;
}

export interface achievementType {
	id: number,
	logo: any,
	title: string,
	disc: string,
>>>>>>> ec57b4511ce3c20a6eafdadf6f46b9dd096537c0
}