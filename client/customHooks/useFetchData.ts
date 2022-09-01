import axios from "axios";
import { getCookie } from "cookies-next";
import { NextRouter, useRouter } from "next/router";
import { baseUrl, eraseCookie } from "../config/baseURL";

export const getQRcodeOrdisableCode = async (status: string, route: NextRouter): Promise<string> => {
	const token = getCookie("jwt");
	const params = new URLSearchParams();
	params.append("is2faEnabled", status);
	return await axios({
		method: "post",
		url: `${baseUrl}auth/2faEnabling`,
		data: params,
		headers: {
			Authorization: `Bearer ${token}`,
		},
		withCredentials: true,
	})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			eraseCookie('jwt');
			route.replace('/');
		});
};

export const Is2FAEnaled = (set: any, setP: any, route: NextRouter) => {
	const token = getCookie("jwt");
	axios
		.get(`${baseUrl}auth/is2faEnabled`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		})
		.then((result) => {
			set(result.data);
			setP(result.data);
		})
		.catch((err) => {
			eraseCookie('jwt');
			route.replace('/');
		});
};

export const check2FACode = async (code: string, route: NextRouter): Promise<boolean>  => {
	const token = getCookie("jwt");
	const params = new URLSearchParams();
	params.append("code", code);
	return await axios({
		method: "post",
		url: `${baseUrl}auth/2faValidate`,
		data: params,
		headers: {
			Authorization: `Bearer ${token}`,
		},
		withCredentials: true,
	})
		.then(() => {
			return true;
		})
		.catch((err) => {
			if (err.response.data.message !== 'Wrong authentication code') {
				eraseCookie('jwt');
				route.replace('/');
			}
			return false;
		});
};

export const LogOut = (route: NextRouter) => {
	const token = getCookie("jwt");
	axios
		.get(`${baseUrl}auth/logout`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		})
		.then(() => route.replace("/"))
		.catch((err) => {
			eraseCookie('jwt');
			route.replace('/');
		});
};
