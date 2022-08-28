import classes from "../../../styles/Profile.module.css";
import profile from "../../../public/profileImage.png";
import Image from "next/image";
import TierGold from "../../../public/LeaderBoard/Tier_Gold.svg";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import option_friend from "../../../public/FriendIcons/three_dots.svg";
import {
	ADDButton,
	FriendButton,
	OptionMenu,
	PendingButton,
} from "../../../pages/search";
import { useOutsideAlerter } from "../ProfileInfoEdit";
import { useAppDispatch } from "../../store/hooks";
import { addFriend, initialState, RemoveFriend } from "../../store/userSlice";
import axios from "axios";
import { UserType } from "../../../Types/dataTypes";
import { useSelector } from "react-redux";
import { ShowErrorMsg, ToggleErrorValue } from "../../store/UI-Slice";

const OptionOfFriend: React.FC<{ isFriend: boolean }> = (props) => {
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
			<div className={classes.optionBtnFriend}>
				{(ctn.query.id === "1337" && <PendingButton />) ||
					(props.isFriend && (
						<FriendButton remove={RemoveFriendHandler} />
					)) || <ADDButton add={AddFriendHandler} />}
				<div className={classes.DotOption}ref={wrapperRef}>
					<Image
						src={option_friend}
						onClick={optionTaggleHandler}
					/>
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

const ProfileFriendInfo: React.FC<{ id: number | undefined }> = (props) => {
	const [userInfo, setUserInfo] = useState<UserType | null>(initialState);
	let ownerId = 0;
	const route = useRouter();
	const dispatch = useAppDispatch();
	const fetchData = async (id: number) => {
		await axios
			.get(`https://test-76ddc-default-rtdb.firebaseio.com/${id}.json`)
			.then((res) => {
				setUserInfo(res.data);
			});
	};
	useEffect(() => {
		if (props.id) fetchData(Number(props.id));
	}, [props.id]);
	ownerId = Number(window.localStorage.getItem("owner"));
	let XP = userInfo?.lvl || 0;
	let lvl = Math.floor(XP / 1000);
	let lvlP = (XP % 1000) / 10;
	let isFriend = userInfo?.friendsID.includes(ownerId) || false;
	if (!userInfo) {
		dispatch(ShowErrorMsg());
		route.replace("/profile");
	}
	if (!userInfo || userInfo?.id === ownerId) route.replace("/profile");
	return (
		<div className={`${classes.profile} `}>
			<OptionOfFriend isFriend={isFriend} />
			<div className={classes.profileInfo}>
				<div className={classes.avatar}>
					{userInfo && <img src={userInfo?.avatar} />}
				</div>
				<div className={classes.profileSection}>
					<div className={classes.nameFriend}>{userInfo?.fullName}</div>
					{/* {isFriend && (
						<div className={classes.status}>{userInfo?.stat}</div>
					)} */}
					<div className={classes.lvl}>Level: {userInfo?.lvl} XP</div>
					<div className={classes.gp}>
						Game Poinrs: {userInfo?.GamePoint} GP
					</div>
					<div className={classes.rank}>Rank: {userInfo?.Rank}</div>
					<div className={classes.tier}>
						Status:
						<span className={classes.gold}> {userInfo?.stat}</span>
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
