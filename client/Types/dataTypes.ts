import { StaticImageData } from "next/image"
import { allRanks } from "../config/baseURL";
import unranked from '../public/Tiers/Unranked.svg';

class Stats {
	XP: number = 0;
	GP: number = 0;
	rank: number = 0;
	numGames: number = 0;
	gamesWon: number = 0;
}

export class rankObj {
	rank: string = allRanks[4];
	color: string = '#BEB5B6';
	tier: any = unranked;
}


export class UserTypeNew {
	id: number = 0;
	login: string = '';
	avatar: string = '';
	fullname: string = '';
	stats: Stats = new Stats();
	rank: number = 0;
	numGames: number = 0;
	gamesWon: number = 0;
	achievement: number[] = [];
	status: string = '';
	relation: string = '';
};

export const EmtyUser : UserTypeNew = {
	id: 0,
	login: '',
	avatar: '',
	fullname: '',
	stats: new Stats(),
	rank: 0,
	numGames: 0,
	gamesWon: 0,
	achievement: [],
	status: '',
	relation: ''
}

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

export interface matchDataType {
	login: string,
	avatar: string;
	badge: number;
	fullName: string;
	games: number;
	Win: number;
	GP: number;
	relation: string;
}

export interface achievementType {
	id: number,
	logo: any,
	title: string,
	disc: string,
}

export interface chatUser {
	id: number;
	imgSrc: StaticImageData;
	firstName?: string;
	lastName?: string;
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
}

export interface HistoryMatchType {
    opponent: string,
    yourScore: number,
    opponentScore: number,
    date: string,
	login: string,
	avatar: string,
	fullname: string
}

export interface chatFormValues {
    cName: string,
    password: string,
    members: Array<string>
}

export interface NotificationType {
	login: string,
	msg: string,
	read: boolean
}


export class GameDataType {
	ball: {ballX: number, ballY: number};
	paddleLeft: {paddleY: number};
	paddleRight: {paddleY: number};
	GameStatus: string
	myScore: number;
	otherScore: number;
	widthPaddle: number;
	HieghtPaddle: number;
	canvasWidth: number;
	canvasHieght: number;
	ballRadius: number;
	constructor(width: number) {
		this.canvasHieght = width / 2;
		this.ball = {ballX: width / 2, ballY: this.canvasHieght / 2};
		this.HieghtPaddle = this.canvasHieght / 8;
		this.paddleLeft = {paddleY: this.canvasHieght / 2 - this.HieghtPaddle / 2};
		this.paddleRight = {paddleY: this.canvasHieght / 2 - this.HieghtPaddle / 2};
		this.GameStatus = '';
		this.myScore = 0;
		this.otherScore = 0;
		this.canvasWidth = width;
		this.widthPaddle = 20.1;
		this.ballRadius = 10;
	}
	setWidth(width: number) {
		this.canvasWidth = width;
		this.canvasHieght = width / 2;
		this.ball = {ballX: width / 2, ballY: this.canvasHieght / 2};
		this.HieghtPaddle = this.canvasHieght / 8;
		this.paddleLeft = {paddleY: this.canvasHieght / 2 - this.HieghtPaddle / 2};
		this.paddleRight = {paddleY: this.canvasHieght / 2 - this.HieghtPaddle / 2};
	}
}

export class liveGamesType {
    firstPlayer: string;
    firstScore: number;
    matchType: string;
    secondPlayer: string;
    secondScore: number;
    gameId: string;
	constructor() {
		this.firstPlayer = '';
		this.firstScore = 0;
		this.matchType = '';
		this.secondPlayer = '';
		this.secondScore = 0;
		this.gameId = '';
		
	}
}