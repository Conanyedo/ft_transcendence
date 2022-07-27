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

const SideNav: React.FC<{ onNav: (page: string) => void }> = (props) => {
	const [page, setPage] = useState("Profile");

	const onClick: MouseEventHandler<HTMLImageElement> = (e) => {
		const target = e.target as HTMLElement;

		const alt = target.alt;
		setPage(alt);
		props.onNav(alt);
	};

	return (
		<div className={`absolute top-0 left-0 bottom-0 ${classes.sidenav}`}>
			<div className={`${classes.sidenav}`}>
				<div className={`${classes.sideItems}`}>
					<div className={classes.backIcons}>
						<Image
							alt="Profile"
							onClick={onClick}
							src={(page === "Profile") ? UserSelected : User}
							width={34}
							height={34}
							style={{ backgroundColor: "#242426" }}
						/>
						<Image
							src={Indicator}
							width={34}
							height={34}
							style={{
								backgroundColor: "#242426",
								visibility: `${
									page === "Profile" ? "visible" : "hidden"
								}`,
							}}
						/>
					</div>

					<div className={classes.backIcons}>
						<Image
							alt="LiveGames"
							onClick={onClick}
							src={(page === "LiveGames") ? LiveGameSelected : LiveGame}
							width={34}
							height={34}
							style={{ backgroundColor: "#242426" }}
						/>
						<Image
							src={Indicator}
							width={34}
							height={34}
							style={{
								backgroundColor: "#242426",
								visibility: `${
									page === "LiveGames" ? "visible" : "hidden"
								}`,
							}}
						/>
					</div>
					<div className={classes.backIcons}>
						<Image
							alt="Game"
							onClick={onClick}
							src={(page === "Game") ? GameSelected : Game}
							width={34}
							height={34}
							style={{ backgroundColor: "#242426" }}
						/>
						<Image
							src={Indicator}
							width={34}
							height={34}
							style={{
								backgroundColor: "#242426",
								visibility: `${
									page === "Game" ? "visible" : "hidden"
								}`,
							}}
						/>
					</div>
					<div className={classes.backIcons}>
						<Image
							alt="Chat"
							onClick={onClick}
							src={(page === "Chat") ? ChatSelected : Chat}
							width={34}
							height={34}
							style={{ backgroundColor: "#242426" }}
						/>
						<Image
							src={Indicator}
							width={34}
							height={34}
							style={{
								backgroundColor: "#242426",
								visibility: `${
									page === "Chat" ? "visible" : "hidden"
								}`,
							}}
						/>
					</div>
				</div>
			</div>
			<div className={`${classes.backIcons} ${classes.logOut}`}>
				<Image
					alt="Logout"
					onClick={onClick}
					src={(page === "Logout") ? LogoutSelected : Logout}
					width={34}
					height={34}
					style={{ backgroundColor: "#242426" }}
				/>
				<Image
					src={Indicator}
					width={34}
					height={34}
					style={{
						backgroundColor: "#242426",
						visibility: `${
							page === "Logout" ? "visible" : "hidden"
						}`,
					}}
				/>
			</div>
		</div>
	);
};

export default SideNav;
