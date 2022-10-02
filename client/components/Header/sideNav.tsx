import Image from "next/image";
import { motion } from "framer-motion";

import UserSelected from "../../public/SelectedSideNav/ProfileSelected.svg";
import User from "../../public/SideNav/Profile.svg";

import LiveGameSelected from "../../public/SelectedSideNav/LiveGameSelected.svg";
import LiveGame from "../../public/SideNav/LiveGame.svg";

import ChatSelected from "../../public/SelectedSideNav/ChatSelected.svg";
import Chat from "../../public/SideNav/Chat.svg";

import GameSelected from "../../public/SelectedSideNav/GameSelected.svg";
import Game from "../../public/SideNav/Game.svg";

import LogoutSelected from "../../public/SelectedSideNav/LogOutSelected.svg";
import Logout from "../../public/Logout.svg";

import classes from "../../styles/sideNav.module.css";
import { useRouter } from "next/router";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { getCookie } from "cookies-next";
import { LogOut } from "../../customHooks/useFetchData";
import socket_notif from "config/socketNotif";

interface N_ITEMS {
	alt: string;
	src: any;
	move: any;
	ref_ctn: MutableRefObject<null> | any;
}

const ItemsNav: React.FC<N_ITEMS> = (props) => {
	const [newMsg, setNewMsg] = useState(false);
	const rout = useRouter();
	const ref = useRef(null);
	const moveHndler = () => {
		props.move(props.alt);
		rout.push(props.alt);
		setNewMsg(false);
	};

	useEffect(() => {
		if (props.alt === '/chat') {
			socket_notif.on('newMsg', () => { // TODO
				setNewMsg(true);
			})
		}
	}, [])

	return (
		<div className={classes.backIcons} onClick={moveHndler}>
			<div className={classes.IconsNav} ref={ref}>
				<Image alt={props.alt} src={props.src} width={79} height={79} />
				{props.alt === '/chat' && newMsg && <div/>}
			</div>
		</div>
	);
};

const SideNav: React.FC<{
	onNav: (page: string) => void;
	currentPos: string;
}> = (props) => {
	const token = getCookie("jwt");
	const ref_nav = useRef(null);
	const router = useRouter();
	const NamePage = "/" + router.pathname.split("/")[1];

	const handlerLogOut = () =>  LogOut(router);

	const NAVITEMS: N_ITEMS[] = [
		{
			alt: "/profile",
			src: NamePage !== "/profile" ? User : UserSelected,
			move: props.onNav,
			ref_ctn: ref_nav,
		},
		{
			alt: "/live-games",
			src: NamePage !== "/live-games" ? LiveGame : LiveGameSelected,
			move: props.onNav,
			ref_ctn: ref_nav,
		},
		{
			alt: "/game",
			src: NamePage !== "/game" ? Game : GameSelected,
			move: props.onNav,
			ref_ctn: ref_nav,
		},
		{
			alt: "/chat",
			src: NamePage !== "/chat" ? Chat : ChatSelected,
			move: props.onNav,
			ref_ctn: ref_nav,
		},
	];
	return (
		<motion.div ref={ref_nav} className={classes.sideNavCtn}>
			<motion.div className={`${classes.sidenav}`}>
				<div className={`${classes.sideItems}`}>
					{NAVITEMS.map((item) => (
						<ItemsNav
							key={item.alt}
							move={item.move}
							alt={item.alt}
							src={item.src}
							ref_ctn={item.ref_ctn}
						/>
					))}
				</div>
				<div className={classes.sideItems}>
					<div
						className={`${classes.backIcons} ${classes.logOut}`}
						onClick={handlerLogOut}
					>
						<Image
							src={
								NamePage === "/logout" ? LogoutSelected : Logout
							}
							width={79}
							height={79}
						/>
					</div>
				</div>
			</motion.div>
			<div className={classes.sidenavInd}>
				<motion.div
					className={`${props.currentPos} ${classes.Indicator}`}
					animate="animate"
				>
					<div className={classes.IndicSvg}></div>
				</motion.div>
			</div>
		</motion.div>
	);
};

export default SideNav;
