import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./store";
import { UserType, initialState as user } from "./userSlice";

// export interface UsersType {
// 	UsrsList: UserType[],
// }

export const initialState: UserType[] = [
];

export const friendListSlice = createSlice({
	name: "allUsers",
	initialState,
	reducers: {
		setFriend: (state, action: PayloadAction<any>) => {
			let tmp:UserType = action.payload;
			state.push(tmp);
		}
	},
});

export const { setFriend } = friendListSlice.actions;
export const selectFrinds = (state: RootState) => state.FriendsSlice;
