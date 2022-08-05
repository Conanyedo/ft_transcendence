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

import Indicator from "../../public/indicator.svg";
import LogoutSelected from "../../public/SelectedSideNav/LogOutSelected.svg";
import Logout from "../../public/Logout.svg";

import classes from "../../styles/sideNav.module.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface N_ITEMS {
	alt: string;
	src: any;
	move: any;
}

const ItemsNav: React.FC<N_ITEMS> = (props) => {
	const moveHndler = () => {
		props.move(() => {
			if (props.alt === "/profile") return classes.profilePos;
			if (props.alt === "/live-games") return classes.liveGamePos;
			if (props.alt === "/game") return classes.gamePos;
			if (props.alt === "/chat") return classes.chatPos;
			return classes.profilePos;
		});
	};
	return (
		<Link href={props.alt} className={classes.backIcons}>
			<Image
				onClick={moveHndler}
				alt={props.alt}
				src={props.src}
				width={34}
				height={34}
				className={classes.backIcons}
			></Image>
		</Link>
	);
};

const SideNav: React.FC<{ onNav: (page: string) => void }> = (props) => {
	const ctn = useRouter();
	// console.log(ctn.pathname.split('/')[1]);
	const NamePage = '/' + ctn.pathname.split('/')[1];
	
	const [posIndicator, setPosIndicator] = useState(() => {
		if (NamePage === "/profile") return classes.profilePos;
		if (NamePage === "/live-games") return classes.liveGamePos;
		if (NamePage === "/game") return classes.gamePos;
		if (NamePage === "/chat") return classes.chatPos;
		return classes.profilePos;
	});

	const NAVITEMS: N_ITEMS[] = [
		{
			alt: "/profile",
			src: NamePage !== "/profile" ? User : UserSelected,
			move: setPosIndicator,
		},
		{
			alt: "/live-games",
			src: NamePage !== "/live-games" ? LiveGame : LiveGameSelected,
			move: setPosIndicator,
		},
		{
			alt: "/game",
			src: NamePage !== "/game" ? Game : GameSelected,
			move: setPosIndicator,
		},
		{
			alt: "/chat",
			src: NamePage !== "/chat" ? Chat : ChatSelected,
			move: setPosIndicator,
		},
	];

	return (
		<>
			<div
				className={`absolute top-0 left-0 bottom-0 ${classes.sidenav}`}
			>
				<div className={`${classes.sideItems}`}>
					{NAVITEMS.map((item) => (
						<ItemsNav
							move={item.move}
							alt={item.alt}
							src={item.src}
						/>
					))}
				</div>
				<div className={`${classes.backIcons} ${classes.logOut}`}>
					<Image
						src={
							NamePage === "Logout" ? LogoutSelected : Logout
						}
						width={34}
						height={34}
						style={{ backgroundColor: "#242426" }}
					/>
				</div>
			</div>
			<div
				className={`absolute top-0 left-0 bottom-0 ${classes.sidenavInd}`}
			>
				<motion.div className={`${posIndicator}`} animate="animate">
					<Image
						src={Indicator}
						width={34}
						height={28}
						style={{
							backgroundColor: "#242426",
						}}
					/>
				</motion.div>
			</div>
		</>
	);
};

export default SideNav;
