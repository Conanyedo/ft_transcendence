import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import classes from "../../styles/sideNav.module.css";

export type CounterState = {
	updateCart: boolean;
	showError: boolean;
};

const initialState: CounterState = {
	updateCart: false,
	showError: false
};

export const UI_Slice = createSlice({
	name: "Toggle",
	initialState,
	reducers: {
		Toggle: (state) => {
			state.updateCart = !state.updateCart;
		},
		ShowErrorMsg: (state) => {
			state.showError = true;
		},
		HideErrorMsg: (state) => {
			state.showError = false;
		}
	},
});
export const { Toggle, ShowErrorMsg, HideErrorMsg } = UI_Slice.actions;
export const ToggleValue = (state: RootState) => state.UI.updateCart;
export const ToggleErrorValue = (state: RootState) => state.UI.showError;

export default UI_Slice.reducer;
