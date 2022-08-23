import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import classes from "../../styles/sideNav.module.css";

export type CounterState = {
	updateCart: boolean;
};

const initialState: CounterState = {
	updateCart: false,
};

export const UI_Slice = createSlice({
	name: "Toggle",
	initialState,
	reducers: {
		Toggle: (state) => {
			state.updateCart = !state.updateCart;
		}
	},
});
export const { Toggle } = UI_Slice.actions;
export const ToggleValue = (state: RootState) => state.UI.updateCart;

export default UI_Slice.reducer;
