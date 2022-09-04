
class Stats {
	XP: number = 0;
	GP: number = 0;
	rank: number = 0;
	numGames: number = 0;
	gamesWon: number = 0;
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
}

export interface achievementType {
	id: number,
	logo: any,
	title: string,
	disc: string,
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