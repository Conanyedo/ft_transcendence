import classes from "../../styles/FriendList.module.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { ReactEventHandler, useEffect, useRef, useState } from "react";
import Router, { useRouter } from "next/router";

import Message from "../../public/SelectedSideNav/ChatSelected.svg";
import Options from "../../public/LeaderBoard/Options.svg";
import profile from "../../public/profileImage.png";
import { OptionMenu } from "../../pages/search";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addFriend, selectUser } from "../store/userSlice";
import { useOutsideAlerter } from "./ProfileInfoEdit";
import { selectUsers, setUsers } from "../store/UsersSlice";
import axios from "axios";
import { setFriend, selectFrinds } from "../store/FriendsSlice";
import { useSelector } from "react-redux";

let hideList = `${classes.listOptions} ${classes.hideListOption}`;

interface FriendDATA {
	id: number;
	avatar: any;
	name: string;
	stat: string;
}

const Friend: React.FC<FriendDATA> = (props) => {
	const profileFriendHandler = () => {
		Router.push("/profile/" + props.id);
	};

	const [optionTaggle, setoptionTaggle] = useState(false);
	const friendRequst: ReactEventHandler = (e) => {
		setoptionTaggle(false);
	};

	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef, setoptionTaggle);

	const optionTaggleHandler = () => setoptionTaggle(!optionTaggle);

	return (
		<div className={classes.friend}>
			<div className={classes.Avatar_name}>
				<div className={classes.avatar}>
					{/* <Image src={profile} /> */}
					<img src={props.avatar} />
				</div>
				<div
					className={classes.friendName}
					onClick={profileFriendHandler}
				>
					{props.name}
				</div>
			</div>
			<div className={classes.statusFriend}>{props.stat}</div>
			<div className={classes.optionFriend}>
				<div className={`${classes.sendMsg} ${classes.hideMsgBtn}`}>
					<Image src={Message} />
				</div>
				<div
					className={`${classes.sendMsg} ${classes.optionsbtnctn}`}
					onClick={optionTaggleHandler}
					ref={wrapperRef}
				>
					<Image src={Options} />
					{optionTaggle && (
						<OptionMenu
							FirstBtn="Unfriend"
							SecondBtn="Block user"
							width="7rem"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export interface UserType {
	id: number;
	avatar: any;
	fullName: string;
	lvl: number;
	GamePoint: number;
	Rank: number;
	Tier: string;
	games: number;
	wins: number;
	me: boolean;
	friendsID: number[];
	friendsPending: number[];
	BlockList: number[];
	friendsRequast: number[];
	stat: string;
}

const ListFriends = () => {
	// const frindList = useSelector(selectFrinds);
	const [listFriend, setListFriend] = useState<UserType[]>();
	let users: UserType[] = [];
	useEffect(() => {
		const fetchData = async () => {
			const data = await axios
				.get(
					"https://test-76ddc-default-rtdb.firebaseio.com/friend.json"
				)
				.then((res) => {
					const entries = Object.entries(res.data);
					entries.map((user) => {
						users.push(user[1]);
					});
					setListFriend(users);
				});
		};
		if (!listFriend) fetchData();
	}, []);
	const wrapperRef = useRef(null);
	return (
		<div className={classes.listFriends} ref={wrapperRef}>
			<div className={classes.friendsCtn}>
				{listFriend &&
					listFriend.map((tmp) => (
						<Friend
							name={tmp.fullName}
							avatar={tmp.avatar}
							id={tmp.id}
							stat={tmp.stat}
						/>
					))}
				{listFriend &&
					listFriend.map((tmp) => (
						<Friend
							name={tmp.fullName}
							avatar={tmp.avatar}
							id={tmp.id}
							stat={tmp.stat}
						/>
					))}
				{listFriend &&
					listFriend.map((tmp) => (
						<Friend
							name={tmp.fullName}
							avatar={tmp.avatar}
							id={tmp.id}
							stat={tmp.stat}
						/>
					))}
				{listFriend &&
					listFriend.map((tmp) => (
						<Friend
							name={tmp.fullName}
							avatar={tmp.avatar}
							id={tmp.id}
							stat={tmp.stat}
						/>
					))}
				{listFriend &&
					listFriend.map((tmp) => (
						<Friend
							name={tmp.fullName}
							avatar={tmp.avatar}
							id={tmp.id}
							stat={tmp.stat}
						/>
					))}
				{listFriend &&
					listFriend.map((tmp) => (
						<Friend
							name={tmp.fullName}
							avatar={tmp.avatar}
							id={tmp.id}
							stat={tmp.stat}
						/>
					))}
			</div>
		</div>
	);
};

export default ListFriends;
