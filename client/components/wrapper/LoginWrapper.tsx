import axios from "axios";
import { CookieValueTypes, getCookie } from "cookies-next";
import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { baseUrl } from "../../config/baseURL";
import LoadingElm from "../loading/Loading_elm";

type PropsType = {
	children: JSX.Element;
};

const checkJWT = async (
	jwt: CookieValueTypes,
	router: NextRouter
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
			router.push('/profile');
		})
		.catch((e) => {
			router.push('/');
			console.log(e)}
		);
};

const LoginWrapper: React.FC<PropsType> = ({ children }) => {
	const router = useRouter();
	const jwt = getCookie("jwt");
	const jwt_2fa = getCookie("jwt-2fa");
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		if (jwt)
			checkJWT(jwt, router);
	}, [router.asPath]);
	if (jwt_2fa && router.asPath === '/')
		router.push('/?_2fa=true');
	if (!isMounted) return <LoadingElm />

	return <>{children}</>;
};

export default LoginWrapper;