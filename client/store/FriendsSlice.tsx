import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserTypeNew } from "../Types/dataTypes";
import type { RootState } from "./store";
export const initialState: UserTypeNew[] = [
];

export const friendListSlice = createSlice({
	name: "allUsers",
	initialState,
	reducers: {
		setFriend: (state, action: PayloadAction<any>) => {
			let tmp:UserTypeNew = action.payload;
			state.push(tmp);
		}
	},
});

export const { setFriend } = friendListSlice.actions;
export const selectFrinds = (state: RootState) => state.FriendsSlice;
