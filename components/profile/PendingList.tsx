import classes from "../../styles/PendingList.module.css";
import Image from "next/image";

import profile from "../../public/profileImage.png";
import React, { useState } from "react";

let hideList = `${classes.listOptions} ${classes.hideListOption}`;

const Pendingfriend: React.FC<friendDataType> = (props) => {
	return (
		<div className={classes.friend}>
			<div className={classes.Avatar_name}>
				<div className={classes.avatar}>
					<Image src={props.Avatar} />
				</div>
				<div className={classes.friendName}>{props.fullName}</div>
			</div>
			<div className={classes.optionFriend}>
				<div className={classes.sendMsg}>Accept</div>
				<div className={`${classes.sendMsg}`}>Refuse</div>
			</div>
		</div>
	);
};

interface friendDataType {
	Avatar: any,
	fullName: string,
}

const PendingList = () => {
	const [optionTaggle, setoptiontaggle] = useState(false);
	const OptionHandler = () => {
		setoptiontaggle(!optionTaggle);
		hideList = optionTaggle
			? `${classes.listOptions}  ${classes.showListOption}`
			: `${classes.listOptions}  ${classes.hideListOption}`;
	};

	return (
		<div className={classes.listFriends}>
			<Pendingfriend fullName="Ayoub boulbaz" Avatar={profile} />
			<Pendingfriend fullName="Younnes Bouddou" Avatar={profile} />
			<Pendingfriend fullName="Abdellah Belhachmi" Avatar={profile} />
			<Pendingfriend fullName="Fati Mryoula" Avatar={profile} />
			<Pendingfriend fullName="mol lban" Avatar={profile} />
			<Pendingfriend fullName="molat Dar lklba" Avatar={profile} />
			<Pendingfriend fullName="mol lban" Avatar={profile} />
			<Pendingfriend fullName="molat Dar lklba" Avatar={profile} />
		</div>
	);
};

export default PendingList;
