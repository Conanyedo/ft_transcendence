// import classes from "../../styles/Profile.module.css";
import classes from "../../../styles/Profile.module.css";
import profile from "../../../public/profileImage.png";
import Image from "next/image";
import pen from "../../public/editPen.svg";
import TierGold from "../../../public/LeaderBoard/Tier_Gold.svg";
import { useRouter } from "next/router";
import React, { ReactEventHandler, useEffect, useRef, useState } from "react";

import add_friend from "../../public/FriendIcons/add_friend.svg";
import SendMsg from "../../public/FriendIcons/SendMsg.svg";
import option_friend from "../../../public/FriendIcons/three_dots.svg";
import { motion } from "framer-motion";
import {
	ADDButton,
	FriendButton,
	OptionMenu,
	PendingButton,
} from "../../../pages/search";
import ProfileInfoEdit from "../ProfileInfoEdit";
import { useOutsideAlerter } from "../ProfileInfoEdit";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Toggle, ToggleValue } from "../../store/UI-Slice";
import { addFriend, initialState, RemoveFriend, selectUser } from "../../store/userSlice";
import { UserType } from "../../store/userSlice";
import { useSelector } from "react-redux";
import axios from "axios";
import { setUsers } from "../../store/UsersSlice";


const OptionOfFriend: React.FC<{isFriend: boolean}> = (props) => {
	const ctn = useRouter();

	const dispatch = useAppDispatch();
	const AddFriendHandler = () => {
		dispatch(addFriend(Number(ctn.query.id)));
	};
	const RemoveFriendHandler = () => {
		dispatch(RemoveFriend(Number(ctn.query.id)));
	};

	const [optionTaggle, setoptionTaggle] = useState(false);
	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef, setoptionTaggle);
	const optionTaggleHandler = () => setoptionTaggle(!optionTaggle);

	return (
		<div className={classes.frindBtns} ref={wrapperRef}>
			<div className={classes.optionBtnFriend}>
				{(ctn.query.id === "1337" && <PendingButton />) ||
					(props.isFriend && (
						<FriendButton remove={RemoveFriendHandler} />
					)) || <ADDButton add={AddFriendHandler} />}
				<div className={classes.OptionIcon}>
					<Image
						src={option_friend}
						onClick={optionTaggleHandler}
						style={{
							backgroundColor: "transparent",
							cursor: "pointer",
						}}
					/>
				</div>
				{optionTaggle && (
					<OptionMenu
						FirstBtn={props.isFriend ? "Message" : "Unfriend"}
						SecondBtn="Block User"
						width="78px"
					/>
				)}
			</div>
		</div>
	);
};

const ProfileFriendInfo: React.FC<{ id: number }> = (props) => {
	const [userInfo, setUserInfo] = useState<UserType>(initialState);
	let ownerId = 0;
	const route = useRouter();
	const fetchData = async (id: number) => {
		await axios
			.get(
				`https://test-76ddc-default-rtdb.firebaseio.com/${id}.json`
			)
			.then((res) => {
				setUserInfo(res.data);
			});
	};
	useEffect(() => {
		if (props.id) fetchData(Number(props.id));
	}, [props.id]);
	ownerId = Number(window.localStorage.getItem("owner"));
	let XP = userInfo.lvl;
	let lvl = Math.floor(XP / 1000);
	let lvlP = (XP % 1000) / 10;
	let isFriend = userInfo.friendsID.includes(ownerId);

	if (userInfo.id === ownerId)
		route.replace('/profile');
	return (
		<div className={`${classes.profile} `}>
			<OptionOfFriend isFriend={isFriend} />
			<div className={classes.profileInfo}>
				<div className={classes.avatar}>
					<Image src={profile} />
				</div>
				<div className={classes.profileSection}>
					<div className={classes.name}>{userInfo.fullName}</div>
					{isFriend && (
						<div className={classes.status}>{userInfo.stat}</div>
					)}
					<div className={classes.lvl}>Level: {userInfo.lvl} XP</div>
					<div className={classes.gp}>
						Game Poinrs: {userInfo.GamePoint} GP
					</div>
					<div className={classes.rank}>Rank: {userInfo.Rank}</div>
					<div className={classes.tier}>
						Tier:{" "}
						<span className={classes.gold}>{userInfo.Tier}</span>
					</div>
				</div>
				<div className={classes.tierIcon}>
					<Image
						style={{ backgroundColor: "transparent" }}
						src={TierGold}
					/>
				</div>
			</div>
			<div className={classes.lvlContainer}>
				<div
					className={classes.lvldata}
				>{`Level ${lvl} - ${lvlP} %`}</div>
				<div
					className={classes.lvlpercent}
					style={{ width: `${lvlP}%` }}
				></div>
			</div>
		</div>
	);
};

export default ProfileFriendInfo;
