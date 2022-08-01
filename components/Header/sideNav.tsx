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
import { MouseEventHandler, useRef, useState } from "react";

interface N_ITEMS {
	alt: string;
	src: any;
	onNav: any;
}

const ItemsNav: React.FC<N_ITEMS> = (props) => {
	return (
		<div className={classes.backIcons}>
			<Image
				alt={props.alt}
				onClick={props.onNav}
				src={props.src}
				width={34}
				height={34}
				style={{ backgroundColor: `#242426` }}
			/>
		</div>
	);
};

const SideNav: React.FC<{ onNav: (page: string) => void }> = (props) => {
	const [page, setPage] = useState("");
	const [posIndicator, setPosIndicator] = useState(classes.profilePos);

	const onClick: MouseEventHandler<HTMLImageElement> = (e: any) => {
		const target = e.target;
		const alt = target.alt;
		setPage(alt);
		props.onNav(alt);

		alt === ""
			? setPosIndicator(classes.profilePos)
			: alt === "live-games"
			? setPosIndicator(classes.liveGamePos)
			: alt === "game"
			? setPosIndicator(classes.gamePos)
			: setPosIndicator(classes.chatPos);
	};
	const NAVITEMS: N_ITEMS[] = [
		{
			alt: "",
			src: page !== "" ? User : UserSelected,
			onNav: props.onNav,
		},
		{
			alt: "live-games",
			src: page !== "live-games" ? LiveGame : LiveGameSelected,
			onNav: props.onNav,
		},
		{
			alt: "game",
			src: page !== "game" ? Game : GameSelected,
			onNav: props.onNav,
		},
		{
			alt: "chat",
			src: page !== "chat" ? Chat : ChatSelected,
			onNav: props.onNav,
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
							alt={item.alt}
							src={item.src}
							onNav={onClick}
						/>
					))}
				</div>
				<div className={`${classes.backIcons} ${classes.logOut}`}>
					<Image
						onClick={onClick}
						src={page === "Logout" ? LogoutSelected : Logout}
						width={34}
						height={34}
						style={{ backgroundColor: "#242426" }}
					/>
				</div>
			</div>
			<div
				className={`absolute top-0 left-0 bottom-0 ${classes.sidenavInd}`}
			>
				<motion.div
					exit={{ opacity: 0 }}
					className={`${posIndicator}`}
					animate="animate"
				>
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
