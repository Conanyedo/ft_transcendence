import { StaticImageData } from "next/image"

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

export interface chatUser {
	id: number;
	imgSrc: StaticImageData;
	firstName: string;
	lastName: string;
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
}