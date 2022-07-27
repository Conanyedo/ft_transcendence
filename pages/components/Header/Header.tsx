import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./Header.module.css";
import { Text } from "../../../styles/styled-components";
import Image from "next/image";
import Search from "../../../public/Icon.svg";
import Notifications from "../../../public/notifications.svg";
import Avatar from "../../../public/profile.jpg";
import DownArrow from "../../../public/Caret down.svg";
import User from "../../../public/User-selected.svg";
import LiveGame from "../../../public/Live-game.svg";
import Chat from "../../../public/chat.svg";
import Game from "../../../public/game-table.svg";

import Indicator from "../../../public/indicator.svg";
import Logout from "../../../public/Logout.svg";

const Header = () => {
	return (
		<>
			<div
				className={`absolute top-0 left-0 bottom-0 ${classes.sidenav}`}
			>
				<div className={`${classes.sidenav}`}>
					<div className={`${classes.sideItems}`}>
						<div className={classes.backIcons}>
							<Image
								src={User}
								width={34}
								height={34}
								style={{ backgroundColor: "#242426" }}
							/>
							<Image
								src={Indicator}
								width={34}
								height={34}
								style={{ backgroundColor: "#242426" }}
							/>
						</div>

						<div className={classes.backIcons}>
							<Image
								src={LiveGame}
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
									visibility: "hidden",
								}}
							/>
						</div>
						<div className={classes.backIcons}>
							<Image
								src={Game}
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
									visibility: "hidden",
								}}
							/>
						</div>
						<div className={classes.backIcons}>
							<Image
								src={Chat}
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
									visibility: "hidden",
								}}
							/>
						</div>
					</div>
				</div>
				<div className={`${classes.backIcons} ${classes.logOut}`}>
					<Image
						src={Logout}
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
							visibility: "hidden",
						}}
					/>
				</div>
			</div>
			<div className={classes.topBar}>
				<div className={classes.inputContainer}>
					<Image src={Search} width={24} height={24} />
					<input
						type="text"
						className={classes.searchInput}
						placeholder="Search"
					/>
				</div>
				<div className={classes.avatarContainer}>
					<div
						style={{
							paddingRight: "30px",
							display: "flex",
							alignItems: "center",
						}}
					>
						<Image src={Notifications} width={28} height={28} />
					</div>

					<div
						style={{
							paddingRight: "30px",
							display: "flex",
							alignItems: "center",
							gap: "0.5rem",
						}}
					>
						<Image
							src={Avatar}
							width={36}
							height={36}
							style={{ borderRadius: "10px" }}
						/>
						<Text>Ikram Kharbouch</Text>
					</div>

					<Image src={DownArrow} width={24} height={24} />
				</div>
			</div>
		</>
	);
};

export default Header;
