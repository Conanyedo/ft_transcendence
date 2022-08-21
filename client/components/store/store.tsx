import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { friendListSlice } from "./FriendsSlice";
import UpdateCart, { UI_Slice } from './UI-Slice';
import UserSlice  from './userSlice';
import { usrsListSlice } from "./UsersSlice";

export const store = configureStore({
	reducer: {
		UI: UI_Slice.reducer,
		UserSlice: UserSlice,
		UsersSlice: usrsListSlice.reducer,
		FriendsSlice: friendListSlice.reducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
