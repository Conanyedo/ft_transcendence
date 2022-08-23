import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { UserType, initialState as user } from "./userSlice";


// export interface UsersType {
// 	UsrsList: UserType[],
// }

export const initialState: UserType[] = []

export const usrsListSlice = createSlice({
	name: "allUsers",
	initialState,
	reducers: {
		setUsers: (state, action: PayloadAction<any>) => {
			let tmp:UserType = action.payload;
			state.push(tmp);
		}
	},
});

export const { setUsers } = usrsListSlice.actions;
export const selectUsers = (state: RootState) => state.UsersSlice;