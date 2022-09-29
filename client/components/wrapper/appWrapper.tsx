import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import classesNav from "../../styles/sideNav.module.css";
import LoadingElm from "../loading/Loading_elm";
import Header from "../Header/Header";
import SideNav from "../Header/sideNav";
import Section from "../section";
import Setting from "../Settings/settings";
import ProfileInfoEdit from "../Settings/ProfileInfoEdit";
import { useDispatch, useSelector } from "react-redux";
import {
	HideErrorMsg,
	Settings,
	Toggle,
	ToggleErrorValue,
	ToggleValue,
} from "../../store/UI-Slice";
import { fetchDATA } from "../../customHooks/useFetchData";
import socket_notif from "config/socketNotif";
import MsgSlideUp from "@components/Settings/slideUpMsg";

type PropsType = {
	children: JSX.Element;
};

const ContentWrapper: React.FC<PropsType> = ({ children }) => {
	const [isAuth, setIsAuth] = useState(false);
	const [socketID, setsocketID] = useState("");
	const displayCard = useSelector(ToggleValue);
	const displaymsg = useSelector(Settings);
	const dispatch = useDispatch();
	const router = useRouter();
	const jwt = getCookie("jwt");
	const [posIndicator, setPosIndicator] = useState(classesNav.hide);
	const ShowError = useSelector(ToggleErrorValue);
	if (ShowError) {
		const timer = () => {
			const id = setTimeout(() => {
				dispatch(HideErrorMsg());
				return () => {
					clearTimeout(id);
				};
			}, 3000);
			return () => clearTimeout(id);
		};
		timer();
	}
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
		if (jwt) fetchDATA(setIsAuth, router, "auth/isAuthorized");
	}, []);
	useEffect(() => {
		navBarHandler(router.asPath);
	}, [router.asPath]);
	if (!jwt) {
		router.replace("/");
		return <LoadingElm />;
	} else if (!isAuth || !socket_notif.id) {
		socket_notif.on("connect", () => {
			setsocketID(socket_notif.id);
		});
		return <LoadingElm />;
	}
	const toggleHandler = () => dispatch(Toggle());

	return (
		<>
			{ShowError && (
				<MsgSlideUp
					msg="User Not Found"
					colorCtn="#FF6482"
					colorMsg="#ECF5FF"
				/>
			)}
			{displaymsg && <Setting />}
			{displayCard && <ProfileInfoEdit setTagle={toggleHandler} />}
			<Header setPos={navBarHandler} />
			<SideNav onNav={navBarHandler} currentPos={posIndicator} />
			<Section elm={children} />
		</>
	);
};

export default ContentWrapper;
