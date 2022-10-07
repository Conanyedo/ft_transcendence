import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { UI_Slice } from './UI-Slice';

export const store = configureStore({
	reducer: {
		UI: UI_Slice.reducer,
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
