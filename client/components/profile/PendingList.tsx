import classes from "../../styles/PendingList.module.css";
import Image from "next/image";

import profile from "../../public/profileImage.png";
import React, { useEffect, useState } from "react";
import { UserType } from "../../Types/dataTypes";
import axios from "axios";

let hideList = `${classes.listOptions} ${classes.hideListOption}`;

const Pendingfriend: React.FC<friendDataType> = (props) => {
	return (
		<div className={classes.friend}>
			<div className={classes.Avatar_name}>
				<div className={classes.avatar}>
					<img src={props.Avatar} />
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

	const [listPanding, setListPanding] = useState<UserType[]>();
	let users:UserType[] = [];
	useEffect(() => {
		const fetchData = async () => {
			const data = await axios
				.get("https://test-76ddc-default-rtdb.firebaseio.com/friend.json")
				.then((res) => {
					const entries = Object.entries(res.data);
					entries.map((user) => {
						users.push(user[1]);
					});
					setListPanding(users);
				});
		};
		if (!listPanding) fetchData();
	}, []);

	return (
		<div className={classes.listFriends}>
			{
				listPanding?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)	
			}{
				listPanding?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)	
			}{
				listPanding?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)	
			}{
				listPanding?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)	
			}{
				listPanding?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)	
			}{
				listPanding?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)	
			}{
				listPanding?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)	
			}
		</div>
	);
};

export default PendingList;
