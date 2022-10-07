import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export type CounterState = {
	updateCart: boolean;
	showError: boolean;
	showErrorGame: boolean;
	showSetting: boolean;
};

const initialState: CounterState = {
	updateCart: false,
	showSetting: false,
	showError: false,
	showErrorGame: false
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
		ShowErrorGameMsg: (state) => {
			state.showErrorGame = true;
		},
		HideErrorGameMsg: (state) => {
			state.showErrorGame = false;
		},
		ShowSettings: (state) => {
			state.showSetting = true;
		},
		HideSettings: (state) => {
			state.showSetting = false;
		}
	},
});
export const { Toggle, ShowErrorMsg, HideErrorMsg, ShowSettings, HideSettings, HideErrorGameMsg, ShowErrorGameMsg } = UI_Slice.actions;
export const ToggleValue = (state: RootState) => state.UI.updateCart;
export const ToggleErrorValue = (state: RootState) => state.UI.showError;
export const ToggleErrorGameValue = (state: RootState) => state.UI.showErrorGame;
export const Settings = (state: RootState) => state.UI.showSetting;

export default UI_Slice.reducer;
