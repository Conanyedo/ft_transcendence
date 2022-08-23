import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import profile from "../../public/profileImage.png";

export type friend = {
	avatar: any;
	fullName: string;
	lvl: number;
	GamePoint: number;
	Rank: number;
	Tier: string;
	friendsID: number[];
};

const initialState: friend[] = [
	{
		avatar: profile,
		fullName: "Younnes Bouddou",
		lvl: 6250,
		GamePoint: 1800,
		Rank: 2180,
		Tier: "Gold",
		friendsID: [15, 13, 20],
	},
    {
		avatar: profile,
		fullName: "Ayoub Boulbaz",
		lvl: 1250,
		GamePoint: 800,
		Rank: 2880,
		Tier: "Gold",
		friendsID: [15, 13, 20],
	},
    {
		avatar: profile,
		fullName: "Abdellah Belhachmi",
		lvl: 7250,
		GamePoint: 1800,
		Rank: 9280,
		Tier: "Gold",
		friendsID: [15, 13, 20],
	},
    {
		avatar: profile,
		fullName: "Ikram Kharbouch",
		lvl: 250,
		GamePoint: 700,
		Rank: 14,
		Tier: "silver",
		friendsID: [15, 13],
	},
];

export const FriendSlice = createSlice({
	name: "FriendList",
	initialState,
	reducers: {},
});
// export const { changeName, changeAvatar, addFriend, RemoveFriend } =
// 	UserSlice.actions;
export const Friends = (state: RootState) => state;

export default FriendSlice;
