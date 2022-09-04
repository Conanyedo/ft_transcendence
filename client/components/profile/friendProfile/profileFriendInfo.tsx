import classes from "../../../styles/Profile.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import option_friend from "../../../public/FriendIcons/three_dots.svg";
import {
	ADDButton,
	FriendButton,
	OptionMenu,
	PendingButton,
} from "../../../pages/search";
import { getRankUser, useOutsideAlerter } from "../../../customHooks/Functions";
import { useAppDispatch } from "../../store/hooks";
import { addFriend, RemoveFriend } from "../../store/userSlice";
import { EmtyUser, UserTypeNew } from "../../../Types/dataTypes";
import { fetchDATA } from "../../../customHooks/useFetchData";
import LoadingElm from "../../loading/Loading_elm";

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
			<span>User Profile</span>
			<div className={classes.options}>
				{(ctn.query.id === "1337" && <PendingButton />) ||
					(props.isFriend && (
						<FriendButton remove={RemoveFriendHandler} />
					)) || <ADDButton add={AddFriendHandler} />}
				<div className={classes.DotOption} ref={wrapperRef}>
					<Image src={option_friend} onClick={optionTaggleHandler} />
					{optionTaggle && (
						<OptionMenu
							FirstBtn={props.isFriend ? "Message" : "Unfriend"}
							SecondBtn="Block User"
							width="78px"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

const ProfileFriendInfo: React.FC<{ id: string | undefined }> = (props) => {
	const [userInfo, setUserInfo] = useState<UserTypeNew>(EmtyUser);
	const [isMounted, setIsMounted] = useState(false);
	let ownerLogin = "cabouelw";
	const route = useRouter();
	const dispatch = useAppDispatch();
	useEffect(() => {
		fetchDATA(setUserInfo, route, `user/info/${props.id}`);
		setIsMounted(true);
		return () => {
			setUserInfo(EmtyUser);
		}
	}, [props.id]);
	if (userInfo?.fullname === "") return <LoadingElm />;
	else if (props.id === ownerLogin) route.replace("/profile");
	const lvl = Math.floor(
		userInfo?.stats.XP === 0 ? 0 : userInfo?.stats.XP / 1000
	);
	const lvlP = (userInfo?.stats.XP % 1000) / 10;
	const tier = getRankUser(userInfo?.stats.GP);
	return (
		<>
		{isMounted &&
			<div className={`${classes.profile} `}>
				<OptionOfFriend isFriend={true} />
				<div className={classes.profileInfo}>
					<div className={classes.avatar}>
						{userInfo && <img src={userInfo?.avatar} />}
					</div>
					<div className={classes.profileSection}>
						<div className={classes.nameFriend}>
							{userInfo?.fullname}
						</div>
						<div className={classes.lvl}>
							Level: {userInfo?.stats.XP} XP
						</div>
						<div className={classes.gp}>
							Game Poinrs: {userInfo?.stats.GP} GP
						</div>
						<div className={classes.rank}>
							Rank: {userInfo?.stats.rank}
						</div>
						<div className={classes.tier}>
							Status:
							<span className={classes.gold}>
								{" "}
								{userInfo?.status}
							</span>
						</div>
					</div>
					<div className={classes.tierIcon}>
						<Image
							style={{ backgroundColor: "transparent" }}
							src={tier[2]}
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
			</div>}
		</>
	);
};

export default ProfileFriendInfo;
