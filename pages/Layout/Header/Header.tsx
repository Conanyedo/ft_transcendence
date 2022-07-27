import React, { useState } from "react";
import classes from "./Header.module.css";
import { Text } from "../../../styles/styled-components";
import Image from "next/image";
import Search from "../../../public/Icon.svg";
import NotificationsOn from "../../../public/notificationsOn.svg";
import NotificationsOff from "../../../public/notificationsOff.svg";
import Avatar from "../../../public/profile.jpg";
import DownArrow from "../../../public/Caret down.svg";

interface DATA {
	image: any;
	name: string;
	ntf: boolean;
}

const dataUser: DATA = {
	image: Avatar,
	name: 'Halima Elgmal',
	ntf: true
}

const Header = () => {
	const [userData]  = useState<DATA>(dataUser);
	return (
		<>
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
						<Image src={userData.ntf ? NotificationsOn : NotificationsOff} width={28} height={28} />
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
							src={userData.image}
							width={36}
							height={36}
							style={{ borderRadius: "10px" }}
						/>
						<Text>{userData.name}</Text>
					</div>

					<Image src={DownArrow} width={24} height={24} />
				</div>
			</div>
		</>
	);
};

export default Header;
