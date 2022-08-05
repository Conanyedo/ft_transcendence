import classes from "../../styles/Profile.module.css";
import profile from "../../public/profileImage.png";
import Image from "next/image";
import pen from "../../public/editPen.svg";
import TierGold from "../../public/LeaderBoard/Tier_Gold.svg";
import { useRouter } from "next/router";
import React, { ReactEventHandler, useEffect, useRef, useState } from "react";

import add_friend from "../../public/FriendIcons/add_friend.svg";
import SendMsg from "../../public/FriendIcons/SendMsg.svg";
import option_friend from "../../public/FriendIcons/three_dots.svg";
import { motion } from "framer-motion";
import { ADDButton, FriendButton, OptionMenu, PendingButton } from "../../pages/search";

interface profileData {
	avatar: any;
	fullName: string;
	lvl: number;
	GamePoint: number;
	Rank: number;
	Tier: string;
	me: boolean;
	friend: boolean;
}

const OptionOfFriend: React.FC<profileData> = (props) => {

	const ctn = useRouter();
	console.log(ctn.query.id);
	
	const [isFriend, setIsFriend] = useState(props.friend);
	const [optionTaggle, setoptionTaggle] = useState(false);
	function useOutsideAlerter(ref: any) {
		useEffect(() => {
			function handleClickOutside(event: any) {
				if (ref.current && !ref.current.contains(event.target)) {
					setoptionTaggle(false);
				}
			}
			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [ref]);
	}
	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef);
	const friendRequst: ReactEventHandler = (e) => {
		if (e.target.innerText !== "Message") setIsFriend(!isFriend);
		setoptionTaggle(false);
	};
	const optionTaggleHandler = () => setoptionTaggle(!optionTaggle);
	return (
		<div className={classes.frindBtns} ref={wrapperRef}>
			<div className={classes.optionBtnFriend}>
				{ctn.query.id === '1337' && <PendingButton />
				|| (isFriend && (
					<FriendButton />
					// <Image
					// 	onClick={friendRequst}
					// 	src={add_friend}
					// 	style={{
					// 		backgroundColor: "transparent",
					// 		cursor: "pointer",
					// 	}}
					// />
				)) ||
					
				(
					<ADDButton /> 
				)}
				<div className={classes.OptionIcon} >
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
						FirstBtn={isFriend ? "Message" : "Unfriend"}
						SecondBtn="Block User"
						width="78px"
					/>
					// <motion.div
					// 	initial={{ scale: 0.5, originX: 0.5 }}
					// 	animate={{ scale: 1 }}
					// 	className={classes.optionMenu}
					// >
					// 	<div
					// 		className={classes.Unfriend}
					// 		onClick={friendRequst}
					// 	>
					// 		{isFriend ? "Message" : "Unfriend"}
					// 	</div>
					// 	<div className={classes.block}>Block User</div>
					// </motion.div>
				)}
			</div>
		</div>
	);
};

const ProfileInfo: React.FC<profileData> = (props) => {
	const ctn = useRouter();

	const XP = props.lvl;
	const lvl = Math.floor(XP / 1000);
	const lvlP = (XP % 1000) / 10;
	// const lvlP = 50;
	return (
		<div className={classes.profile}>
			{(props.me && (
				<div className={classes.editBtn}>
					<button>
						<Image
							src={pen}
							style={{ backgroundColor: "transparent" }}
						/>
						<span>Edit profile</span>
					</button>
				</div>
			)) || <OptionOfFriend {...props} />}
			<div className={classes.profileInfo}>
				<div className={classes.avatar}>
					<Image src={profile} />
				</div>
				<div className={classes.profileSection}>
					<div className={classes.name}>{props.fullName}</div>
					{props.friend && !props.me && (
						<div className={classes.status}>Online</div>
					)}
					<div className={classes.lvl}>Level: {props.lvl} XP</div>
					<div className={classes.gp}>
						Game Poinrs: {props.GamePoint} GP
					</div>
					<div className={classes.rank}>Rank: {props.Rank}</div>
					<div className={classes.tier}>
						Tier: <span className={classes.gold}>{props.Tier}</span>
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

export default ProfileInfo;
