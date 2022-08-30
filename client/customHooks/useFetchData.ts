import axios from "axios";
import { getCookie } from "cookies-next";
import { NextRouter, useRouter } from "next/router";
import { baseUrl } from "../config/baseURL";

function useFetchData(api: string) {
	const token = getCookie("jwt");
	if (!token) return;
	const route = useRouter();
	axios
		.get(`${baseUrl}auth/${api}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		})
		.then((result) => {
			if (result.data) route.push("/profile");
		})
		.catch((err) => {
			console.log(err);
		});
}

export const getQRcodeOrdisableCode = async (status: string): Promise<string> => {
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
			console.log(err);
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
		.catch((err) => route.replace('/'));
};

export const check2FACode = async (code: string, router: NextRouter): Promise<boolean>  => {
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
			if (err.response.data.message !== 'Wrong authentication code')
				router.replace('/');
			return false;
		});
};

export const LogOut = (router: NextRouter) => {
	const token = getCookie("jwt");
	axios
		.get(`${baseUrl}auth/logout`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		})
		.then(() => router.push("/"))
		.catch((err) => console.log(err));
};

export default useFetchData;
