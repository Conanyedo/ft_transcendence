import { MutableRefObject } from "react";
import { allRanks } from "../config/baseURL";
import unranked from "../public/Tiers/Unranked.svg";

class Stats {
  XP: number = 0;
  GP: number = 0;
  rank: number = 0;
  numGames: number = 0;
  gamesWon: number = 0;
}

export class rankObj {
  rank: string = allRanks[4];
  color: string = "#BEB5B6";
  tier: any = unranked;
}

export class UserTypeNew {
  id: number = 0;
  login: string = "";
  avatar: string = "";
  fullname: string = "";
  stats: Stats = new Stats();
  rank: number = 0;
  GP: number = 0;
  numGames: number = 0;
  gamesWon: number = 0;
  achievement: number[] = [];
  status: string = "";
  relation: string = "";
  constructor() {}
}

export const EmtyUser: UserTypeNew = {
  id: 0,
  login: "",
  avatar: "",
  fullname: "",
  stats: new Stats(),
  rank: 0,
  GP: 0,
  numGames: 0,
  gamesWon: 0,
  achievement: [],
  status: "",
  relation: "",
};

export interface UserType {
  id: number;
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
  friendsPending: number[];
  BlockList: number[];
  friendsRequast: number[];
  stat: string;
  RankPos: number;
}

export interface matchDataType {
  login: string;
  avatar: string;
  badge: number;
  fullName: string;
  games: number;
  Win: number;
  GP: number;
  relation: string;
}

export interface achievementType {
  id: number;
  logo: any;
  title: string;
  disc: string;
}

export class friend {
  avatar: string = "";
  fullname: string = "";
  login: string = "";
  status: string = "";
}

/* -------------------------------------------------------------------------- */
/*                             Chat Channel Types                             */
/* -------------------------------------------------------------------------- */

export interface ChannelData {
  oldPath?: string;
  avatar?: string;
  name: string;
  type: string;
  password?: string;
  members?: string[];
}

export const initialChnlState: ChannelData = {
  avatar: "",
  name: "",
  type: "Public",
  password: "",
  members: [],
};
export interface member {
  login: string;
  fullname: string;
  avatar: string;
  status: string;
}

export interface channelMembers {
  owner: member[];
  admins: member[];
  members: member[];
  muted: member[];
}

/* -------------------------------------------------------------------------- */
/*                        Chat ChatConversations Types                        */
/* -------------------------------------------------------------------------- */

export const initialconv: conversations = {
  convId: "0",
  type: "",
  avatar: "",
  name: "",
  status: "",
  membersNum: 0,
  unread: 0,
  login: "",
};

export interface conversations {
  convId?: string;
  type: string;
  avatar: string;
  name: string;
  lastUpdate?: Date;
  membersNum?: number;
  status: string;
  unread: number;
  login: string;
}

/* -------------------------------------------------------------------------- */
/*                             Chat Messages types                            */
/* -------------------------------------------------------------------------- */
export interface MsgData {
  msg: string;
  sender: string;
  fullname?: string;
  invitation: string;
  status: string;
  date: Date;
  convId: string;
  msgId: string;
}
export interface chatUser {
  // Chat Page Fetched data
  convId: number; // the id of converstaion
  avatar: string; // path of pic
  name: string; // name
  membersNum?: string; // channel members
  status?: string; // profile status
  type: any; // ! string type of conversation  Dm / Public / Protected / Private
  login: string; // unique login
  relation: string; //  Dm : Blocked or Friend / Banned / Muted / Left / Member
}

export interface chatMsg {
  // Data for message component
  convId: any; // the id of conversation
  msgId: string; // Msg Id /  ! invite message cases
  msgContent: string | JSX.Element;
  time: string; // Date of message
  type: any;
  name: string;
}

export interface color {
  color: string;
}

export interface HistoryMatchType {
  opponent: string;
  yourScore: number;
  opponentScore: number;
  date: string;
  login: string;
  avatar: string;
  fullname: string;
}

export interface chatFormValues {
  cName: string;
  password: string;
  members: Array<string>;
}

export interface NotificationType {
  login: string;
  fullname: string;
  avatar: string;
  status: string;
  gameId: string;
  type: string;
  refresh: any;
  notifId: string;
}

export class GameDataType {
  ball: { ballX: number; ballY: number };
  paddleLeft: { paddleY: number };
  paddleRight: { paddleY: number };
  GameStatus: string;
  myScore: number;
  otherScore: number;
  widthPaddle: number;
  HieghtPaddle: number;
  canvasWidth: number;
  canvasHieght: number;
  ballRadius: number;
  constructor(width: number) {
    this.canvasHieght = width / 2;
    this.ball = { ballX: width / 2, ballY: this.canvasHieght / 2 };
    this.HieghtPaddle = this.canvasHieght / 8;
    this.paddleLeft = {
      paddleY: this.canvasHieght / 2 - this.HieghtPaddle / 2,
    };
    this.paddleRight = {
      paddleY: this.canvasHieght / 2 - this.HieghtPaddle / 2,
    };
    this.GameStatus = "";
    this.myScore = 0;
    this.otherScore = 0;
    this.canvasWidth = width;
    this.widthPaddle = 20.1;
    this.ballRadius = 10;
  }
  setWidth(width: number) {
    this.canvasWidth = width;
    this.canvasHieght = width / 2;
    this.ball = { ballX: width / 2, ballY: this.canvasHieght / 2 };
    this.HieghtPaddle = this.canvasHieght / 8;
    this.paddleLeft = {
      paddleY: this.canvasHieght / 2 - this.HieghtPaddle / 2,
    };
    this.paddleRight = {
      paddleY: this.canvasHieght / 2 - this.HieghtPaddle / 2,
    };
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
    this.firstPlayer = "";
    this.firstScore = 0;
    this.matchType = "";
    this.secondPlayer = "";
    this.secondScore = 0;
    this.gameId = "";
  }
}
export class gameControleType {
  ball: { ballX: number; ballY: number };
  paddleLeft: { paddleY: number };
  paddleRight: { paddleY: number };
  canvasWidth: number;
  canvasHieght: number;
  HieghtPaddle: number;
  widthPaddle: number;
  ballRadius: number;
  themeMap: number;
  constructor(width: number) {
    this.themeMap = 0;
    this.canvasWidth = width;
    this.canvasHieght = width / 2;
    this.ballRadius = 10;
    this.HieghtPaddle = this.canvasHieght / 8;
    this.widthPaddle = 20.1;
    this.ball = { ballX: width / 2, ballY: this.canvasHieght / 2 };
    this.paddleLeft = {
      paddleY: this.canvasHieght / 2 - this.HieghtPaddle / 2,
    };
    this.paddleRight = {
      paddleY: this.canvasHieght / 2 - this.HieghtPaddle / 2,
    };
  }
}

export class headerGameType {
  gameId: string;
  click: boolean;
  constructor() {
    this.gameId = "";
    this.click = false;
  }
}

export class headerDataType {
  firstPlayer: string;
  firstScore: number;
  gameType: string;
  secondPlayer: string;
  secondScore: number;
  gameId: string;
  click: boolean;
  themeMap: number;
  constructor() {
    this.firstPlayer = "";
    this.firstScore = 0;
    this.gameType = "";
    this.secondPlayer = "";
    this.secondScore = 0;
    this.gameId = "";
    this.click = false;
    this.themeMap = 0;
  }
}

export class FriendOnline {
  login: string = "";
  fullname: string = "";
  avatar: string = "";
  status: string = "";
}

export interface N_ITEMS {
  alt: string;
  src: any;
  ref_ctn: MutableRefObject<null> | any;
}
