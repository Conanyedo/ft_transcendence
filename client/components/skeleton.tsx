import React, { Suspense, useEffect, useRef, useState } from "react";
import Header from "./Header/Header";
import SideNav from "./Header/sideNav";
import classesNav from "../styles/sideNav.module.css";
import { NextRouter, useRouter } from "next/router";
import ProfileInfoEdit from "./profile/ProfileInfoEdit";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
	HideErrorMsg,
	Settings,
	Toggle,
	ToggleErrorValue,
	ToggleValue,
} from "./store/UI-Slice";
import Section from "./section";
import classes from "../styles/Profile.module.css";
import { getCookie } from "cookies-next";
import Setting from "./profile/settings";
import MsgSlideUp from "./slideUpMsg";
import axios from "axios";
import dynamic from "next/dynamic";

const fetchData = async (set: any, router: NextRouter) => {
	const token = getCookie("jwt");
	const requestOptions = {
		Authorization: `Bearer ${token}`,
	};
	await axios
		.get(`http://localhost:5000/auth/isAuthenticated`, {
			headers: requestOptions,
			withCredentials: true,
			method: "GET",
		})
		.then((res) => {
			set(true);
		})
		.catch((err) => {
			set(false);
			router.replace("/");
		});
};

const DynamicHeader = dynamic(() => import("./Header/Header"), {
	loading: () => <></>,
});

const Skeleton = (props: { elm: any }) => {
	const ctn = useRouter();
	const dispatch = useAppDispatch();
	const displayCard = useAppSelector(ToggleValue);
	const displaymsg = useAppSelector(Settings);
	const ShowError = useAppSelector(ToggleErrorValue);
	const [isAuthenticated, setisAuthenticated] = useState(false);
	const [posIndicator, setPosIndicator] = useState(classesNav.hide);

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
	useEffect(() => {
		fetchData(setisAuthenticated, ctn);
		navBarHandler(NamePage);
	}, [ctn.pathname]);
	const toggleHandler = () => dispatch(Toggle());
	if (ShowError) {
		setTimeout(() => {
			dispatch(HideErrorMsg());
		}, 3000);
	}
	return (
		<>
			<Suspense fallback={`Loading...`}>
				<style global jsx>{`
					div#__next {
						height: 100%;
					}
				`}</style>
				{ShowError && (
					<MsgSlideUp
						msg="User Not Found"
						colorCtn="#FF6482"
						colorMsg="#ECF5FF"
					/>
				)}
				{displaymsg && <Setting />}
				{displayCard && <ProfileInfoEdit setTagle={toggleHandler} />}
				{isAuthenticated && <DynamicHeader setPos={navBarHandler} />}
				{isAuthenticated && (
					<SideNav onNav={navBarHandler} currentPos={posIndicator} />
				)}
				{isAuthenticated && <Section elm={props.elm} />}
				{props.elm}
			</Suspense>
		</>
	);
};

export default Skeleton;
