import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import classes from "../../styles/sideNav.module.css";

export type CounterState = {
	updateCart: boolean;
	showError: boolean;
	showSetting: boolean;
};

const initialState: CounterState = {
	updateCart: false,
	showSetting: false,
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
		},
		ShowSettings: (state) => {
			state.showSetting = true;
		},
		HideSettings: (state) => {
			state.showSetting = false;
		}
	},
});
export const { Toggle, ShowErrorMsg, HideErrorMsg, ShowSettings, HideSettings } = UI_Slice.actions;
export const ToggleValue = (state: RootState) => state.UI.updateCart;
export const ToggleErrorValue = (state: RootState) => state.UI.showError;
export const Settings = (state: RootState) => state.UI.showSetting;

export default UI_Slice.reducer;
