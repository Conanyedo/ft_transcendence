import Image from "next/image";

import UserSelected from "../../../public/SelectedSideNav/ProfileSelected.svg";
import User from "../../../public/SideNav/Profile.svg";

import LiveGameSelected from "../../../public/SelectedSideNav/LiveGameSelected.svg";
import LiveGame from "../../../public/SideNav/LiveGame.svg";

import ChatSelected from "../../../public/SelectedSideNav/ChatSelected.svg";
import Chat from "../../../public/SideNav/Chat.svg";

import GameSelected from "../../../public/SelectedSideNav/GameSelected.svg";
import Game from "../../../public/SideNav/Game.svg";

import Indicator from "../../../public/indicator.svg";
import LogoutSelected from "../../../public/SelectedSideNav/LogOutSelected.svg";
import Logout from "../../../public/Logout.svg";

import classes from "./sideNav.module.css";
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
	const [page, setPage] = useState("Profile");
	const [marginTop, setMarginTop] = useState(15.5);

	const onClick: MouseEventHandler<HTMLImageElement> = (e) => {
		const target = e.target as HTMLElement;
		const alt = target.alt;
		setPage(alt);
		props.onNav(alt);

		(alt === 'Profile') ? setMarginTop(15.5) : (alt === 'LiveGames') ? setMarginTop(21.5) : (alt === 'Game') ?  setMarginTop(27.5) : (alt === 'Chat') ? setMarginTop(33.5) : setMarginTop(-100);
		console.log(marginTop);
		
	};
	const NAVITEMS: N_ITEMS[] = [
		{
			alt: "Profile",
			src: page !== "Profile" ? User : UserSelected,
			onNav: props.onNav,
		},
		{
			alt: "LiveGames",
			src: page !== "LiveGames" ? LiveGame : LiveGameSelected,
			onNav: props.onNav,
		},
		{
			alt: "Game",
			src: page !== "Game" ? Game : GameSelected,
			onNav: props.onNav,
		},
		{
			alt: "Chat",
			src: page !== "Chat" ? Chat : ChatSelected,
			onNav: props.onNav,
		},
	];
	return (
		<>
			<div
				className={`absolute top-0 left-0 bottom-0 ${classes.sidenav}`}
			>
				<div className={`${classes.sidenav}`}>
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
							alt="Logout"
							onClick={onClick}
							src={page === "Logout" ? LogoutSelected : Logout}
							width={34}
							height={34}
							style={{ backgroundColor: "#242426" }}
						/>
					</div>
				</div>
			</div>
			<div
				className={`absolute top-0 left-0 bottom-0 ${classes.sidenavInd}`}
			>
				<div style={
					{
						marginTop: `${marginTop}rem`,
						backgroundColor: '#242426'
					}
				}>
					<Image
						src={Indicator}
						width={34}
						height={34}
						style={{
							backgroundColor: "#242426",
						}}
					/>
				</div>
			</div>
		</>
	);
};

export default SideNav;
