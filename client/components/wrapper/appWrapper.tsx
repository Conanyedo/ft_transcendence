import axios from "axios";
import { CookieValueTypes, getCookie } from "cookies-next";
import { NextRouter, useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { baseUrl } from "../../config/baseURL";
import Skeleton from "../skeleton";
import classes from "../../styles/Loading.module.css";
import classesNav from "../../styles/sideNav.module.css";
import LoadingElm from "../loading/Loading_elm";
import Header from "../Header/Header";
import SideNav from "../Header/sideNav";
import Section from "../section";

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
			set(true);
		})
		.catch(() => router.replace("/"));
};

const ContentWrapper: React.FC<PropsType> = ({ children }) => {
	const [isAuth, setIsAuth] = useState(true);
	const router = useRouter();
	const jwt = getCookie("jwt");
	const [posIndicator, setPosIndicator] = useState(classesNav.hide);
	const navBarHandler = (page: string) => {
		setPosIndicator(() => {
			if (page === "/profile") return classesNav.profilePos;
			if (page === "/live-games") return classesNav.liveGamePos;
			if (page === "/game") return classesNav.gamePos;
			if (page === "/chat") return classesNav.chatPos;
			return classesNav.hide;
		});
	};
	useEffect(() => {
		checkJWT(jwt, router, setIsAuth);
		navBarHandler(router.asPath);
	}, []);
	if (!jwt) router.replace("/");
	else
	if (!isAuth) return <LoadingElm />;

	return (
		<>
			<Header setPos={navBarHandler} />
			<SideNav onNav={navBarHandler} currentPos={posIndicator} />
			<Section elm={children} />
		</>
	);
};

export default ContentWrapper;
