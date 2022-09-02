import {  getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import classesNav from "../../styles/sideNav.module.css";
import LoadingElm from "../loading/Loading_elm";
import { fetchDATA } from "../../customHooks/useFetchData";

type PropsType = {
	children: JSX.Element;
};

const GameWrapper: React.FC<PropsType> = ({ children }) => {
	const [isAuth, setIsAuth] = useState(false);
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
		if (jwt)
			fetchDATA(setIsAuth, router, 'auth/isAuthorized');
		navBarHandler(router.asPath);
	}, []);
	if (!jwt) {
		router.replace("/");
		return <LoadingElm />;
	}
	else if (!isAuth) return <LoadingElm />;

	return (
		<>
			{children}
		</>
	);
};

export default GameWrapper;
