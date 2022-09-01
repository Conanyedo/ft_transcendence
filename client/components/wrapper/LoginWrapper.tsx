import axios from "axios";
import { CookieValueTypes, getCookie } from "cookies-next";
import { NextRouter, useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { baseUrl, eraseCookie } from "../../config/baseURL";
import LoadingElm from "../loading/Loading_elm";

type PropsType = {
	children: JSX.Element;
};

const checkJWT = async (
	jwt: CookieValueTypes,
	router: NextRouter,
	set: Dispatch<SetStateAction<boolean>>
) => {
	await axios({
		method: "get",
		url: `${baseUrl}auth/isAuthorized`,
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		withCredentials: true,
	})
		.then(() => {
			router.push("/profile");
			eraseCookie("jwt-2fa");
		})
		.catch((e) => {
			set(false);
			eraseCookie("jwt");
			router.push("/");
		});
};

const LoginWrapper: React.FC<PropsType> = ({ children }) => {
	const router = useRouter();
	const jwt = getCookie("jwt");
	const jwt_2fa = getCookie("jwt-2fa");
	const [isMounted, setIsMounted] = useState(false);
	const [IsAuth, setIsAuth] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);
	if (jwt) {
		checkJWT(jwt, router, setIsAuth);
		return <LoadingElm />;
	}
	else if (jwt_2fa && router.asPath === "/") {
		router.push("/?_2fa=true");
		return <LoadingElm />;
	}
	else if (IsAuth) return <LoadingElm />;

	return <>{isMounted && children}</>;
};

export default LoginWrapper;
