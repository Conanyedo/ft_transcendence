import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import cabouelw from "../../public/Profils/cabouelw.jpg";
import ikrkharb from "../../public/Profils/ikrkharb.jpg";
import abbelhac from "../../public/Profils/abbelhac.png";
import ybouddou from "../../public/Profils/ybouddou.jpg";
import aboulbaz from "../../public/Profils/aboulbaz.png";
import { UserType } from "../../Types/dataTypes";

// export interface UserType {
// 	id: number,
// 	avatar: string;
// 	fullName: string;
// 	lvl: number;
// 	GamePoint: number;
// 	Rank: number;
// 	Tier: string;
// 	games: number;
// 	wins: number;
// 	me: boolean;
// 	friendsID: number[];
// 	friendsPending: number[],
// 	BlockList: number[],
// 	friendsRequast: number[],
// 	stat: string,
// 	RankPos: number,
// };

export let initialState: UserType = {
	id: 0,
	avatar: '',
	fullName: '',
	lvl: 0,
	GamePoint: 0,
	Rank: 0,
	Tier: '',
	games: 0,
	wins: 0,
	me: false,
	friendsID: [],
	friendsPending: [],
	BlockList: [],
	friendsRequast: [],
	stat: '',
	RankPos: 0,

}

// const initialState: UserType = {
	// id: 1001,
	// avatar: cabouelw,
	// fullName: "Choaib Abouelwafa",
	// lvl: 5250,
	// GamePoint: 1800,
	// Rank: 2180,
	// Tier: "Gold",
	// games: 120,
	// wins: 90,
	// me: true,
	// friendsID: [1002, 1005, 1003, 1004],
	// friendsPending: [1004],
	// BlockList: [1003],
	// friendsRequast: [1005],
	// stat: 'online',
	// RankPos: 1,
// };

// const user1: UserType = {
	// id: 1002,
	// avatar: aboulbaz,
	// fullName: "ayoub boulbaz",
	// lvl: 3350,
	// GamePoint: 1800,
	// Rank: 2180,
	// Tier: "Gold",
	// games: 110,
	// wins: 90,
	// me: true,
	// friendsID: [1002, 1005],
	// friendsPending: [1003],
	// BlockList: [1004],
	// friendsRequast: [1005],
	// stat: 'online',
	// RankPos: 2,
// };

// const user2: UserType = {
	// id: 1003,
	// avatar: ybouddou,
	// fullName: "younnes bouddou",
	// lvl: 2650,
	// GamePoint: 1800,
	// Rank: 2180,
	// Tier: "Gold",
	// games: 105,
	// wins: 90,
	// me: true,
	// friendsID: [1004],
	// friendsPending: [1002],
	// BlockList: [1001],
	// friendsRequast: [1005],
	// stat: 'online',
	// RankPos: 3,
// };

// const user3: UserType = {
	// id: 1004,
	// avatar: abbelhac,
	// fullName: "Abdellah Belhachmi",
	// lvl: 250,
	// GamePoint: 400,
	// Rank: 180,
	// Tier: "Gold",
	// games: 30,
	// wins: 10,
	// me: false,
	// friendsID: [1002],
	// friendsPending: [1004],
	// BlockList: [1003],
	// friendsRequast: [1005],
	// stat: 'offline',
	// RankPos: 4,
// };

// const user4: UserType = {
// 	id: 1005,
// 	avatar: ikrkharb,
// 	fullName: "Ikram Kharbouch",
// 	lvl: 250,
// 	GamePoint: 400,
// 	Rank: 180,
// 	Tier: "silver",
// 	games: 11,
// 	wins: 10,
// 	me: false,
// 	friendsID: [1004],
// 	friendsPending: [1002],
// 	BlockList: [1001],
// 	friendsRequast: [1003],
// 	stat: 'offline',
// 	RankPos: 5,
// };


export let UserSlice = createSlice({
	name: "UserData",
	initialState,
	reducers: {
		setUser: (state: UserType , action: PayloadAction<UserType>) => {
			state.BlockList = action.payload.BlockList;
			state.GamePoint = action.payload.GamePoint;
			state.Rank = action.payload.Rank;
			state.RankPos = action.payload.RankPos;
			state.Tier = action.payload.Tier;
			state.avatar = action.payload.avatar;
			state.friendsID = action.payload.friendsID;
			state.friendsPending = action.payload.friendsPending;
			state.friendsRequast = action.payload.friendsRequast;
			state.fullName = action.payload.fullName;
			state.games = action.payload.games;
			state.id = action.payload.id;
			state.lvl = action.payload.lvl;
			state.me = action.payload.me;
			state.stat = action.payload.stat;
			state.wins = action.payload.wins;
		},
		changeName: (state, action: PayloadAction<string>) => {
			state.fullName = action.payload;
		},
		changeAvatar: (state, action: PayloadAction<any>) => {
			state.avatar = action.payload;
		},
		addFriend: (state, action: PayloadAction<number>) => {
			if (!state.friendsID.includes(action.payload))
				state.friendsID = [...state.friendsID, action.payload];
		},
		RemoveFriend: (state, action: PayloadAction<number>) => {
			state.friendsID = state.friendsID.filter(
				(id) => id !== action.payload
			);
		}
	},
});
export const { setUser, changeName, changeAvatar, addFriend, RemoveFriend } =
	UserSlice.actions;
export const selectUser = (state: RootState) => state.UserSlice;

export default UserSlice.reducer;
