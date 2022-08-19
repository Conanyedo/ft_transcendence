import Image from "next/image";

import classes from "../../styles/BlockList.module.css";
import profile from "../../public/profileImage.png";
import { useEffect, useState } from "react";
import { UserType } from "../../Types/dataTypes";
import axios from "axios";

const Pendingfriend: React.FC<friendDataType> = (props) => {
	return (
		<div className={classes.friend}>
			<div className={classes.Avatar_name}>
				<div className={classes.avatar}>
					<img src={props.Avatar} />
				</div>
				<div className={classes.friendName}>{props.fullName}</div>
			</div>
			<div className={`${classes.sendMsg}`}>Unblock</div>
		</div>
	);
};

interface friendDataType {
	Avatar: any;
	fullName: string;
}

const BlockList = () => {
	const [listblock, setListblock] = useState<UserType[]>();
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
					setListblock(users);
				});
		};
		if (!listblock) fetchData();
	}, []);


	return (
		<div className={classes.listFriends}>
			{
				listblock?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)
			}{
				listblock?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)
			}{
				listblock?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)
			}{
				listblock?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)
			}{
				listblock?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)
			}{
				listblock?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)
			}{
				listblock?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)
			}{
				listblock?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)
			}{
				listblock?.map((user) => <Pendingfriend fullName={user.fullName} Avatar={user.avatar} />)
			}
		</div>
	);
};

export default BlockList;
