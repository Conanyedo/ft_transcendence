import React, { useState } from "react";
import AppContent from "./Appcontent";
import Header from "./Header/Header";
import classes from "../styles/sideBar.module.css";
import SideNav from "./Header/sideNav";
import classesNav from "../styles/sideNav.module.css";
import { useRouter } from "next/router";
import ProfileInfoEdit from "./profile/ProfileInfoEdit";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Toggle, ToggleValue } from "./store/UI-Slice";

const Skeleton = (props: { elm: any }) => {
	const ctn = useRouter();
	const NamePage = "/" + ctn.pathname.split("/")[1];
	const navBarHandler = (page: string) => {
		setPosIndicator(() => {
			if (page === "/profile") return classesNav.profilePos;
			if (page === "/live-games") return classesNav.liveGamePos;
			if (page === "/game") return classesNav.gamePos;
			if (page === "/chat") return classesNav.chatPos;
			return classesNav.hide;
		});
	};
	const [posIndicator, setPosIndicator] = useState(() => {
		if (NamePage === "/profile") return classesNav.profilePos;
		if (NamePage === "/live-games") return classesNav.liveGamePos;
		if (NamePage === "/game") return classesNav.gamePos;
		if (NamePage === "/chat") return classesNav.chatPos;
		return classesNav.hide;
	});

	const displayCard = useAppSelector(ToggleValue);
	const dispatch = useAppDispatch();
	const toggleHandler = () => dispatch(Toggle());
	return (
		<div className={classes["app-container"]}>
			{displayCard && <ProfileInfoEdit setTagle={toggleHandler} />}
			<Header setPos={navBarHandler} />
			<SideNav onNav={navBarHandler} currentPos={posIndicator} />
			<AppContent elm={props.elm} />
		</div>
	);
};

export default Skeleton;
