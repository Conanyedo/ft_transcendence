import axios from "axios";
import { getCookie } from "cookies-next";
import { NextRouter, useRouter } from "next/router";

function useFetchData(api: string) {
	const token = getCookie("jwt");
	if (!token) return;
	const route = useRouter();
	const data = async () => {
		const result = await axios.get(`http://localhost:5000/auth/${api}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		});

		if (result.data) route.push("/profile");
	};
	try {
		return data();
	} catch {
		return false;
	}
}

export const getQRcodeOrdisableCode = async (status: string) => {
	const token = getCookie("jwt");
	const params = new URLSearchParams();
	params.append("is2faEnabled", status);
	try {
		const result = await axios({
			method: "post",
			url: `http://localhost:5000/auth/2faEnabling`,
			data: params,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		});
		return result.data;
	} catch {}
};

export const Is2FAEnaled = (set: any, setP: any) => {
	let res = false;
	const check = async () => {
		const token = getCookie("jwt");
		const result = await axios.get(
			`http://localhost:5000/auth/is2faEnabled`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				withCredentials: true,
			}
		);
		set(result.data);
		setP(result.data);
	};
	try {
		check();
	} catch {}
	return res;
};

export const check2FACode = async (code: string) => {
	const token = getCookie("jwt");
	const params = new URLSearchParams();
	params.append("code", code);
	try {
		await axios({
			method: "post",
			url: `http://localhost:5000/auth/2faValidate`,
			data: params,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		});
		return true;
	} catch (err) {
		return false;
	}
};

export const LogOut = (router: NextRouter) => {
	const token = getCookie("jwt");
	const dataFetch = async () => {
		await axios.get(`http://localhost:5000/auth/logout`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		});
		router.push("/");
	};
	try {
		dataFetch();
	} catch {}
};

export default useFetchData;
