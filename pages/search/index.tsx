import { motion } from "framer-motion";
import classes from "../../styles/Search.module.css";
import Image from "next/image";
import profile from "../../public/profileImage.png";
import Union from "../../public/FriendIcons/Union.svg";
import Friend from "../../public/FriendIcons/FriendIcon.svg";
import Option from "../../public/FriendIcons/OptionIcon.svg";
import Pending from "../../public/FriendIcons/Pending.svg";
import AddFriend from "../../public/FriendIcons/ADDFriend.svg";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface friendDataType {
	Avatar: any;
	fullName: string;
	stat: string;
}

export const FriendButton = () => {
	return (
		<div className={classes.btnfriend}>
			<div className={classes.Hover}>
				<Image src={Union} />
			</div>
			<span className={classes.AddBTNHover}>Unfriend</span>
			<div className={classes.notHover}>
				<Image src={Friend} />
			</div>
			<span className={classes.AddBTN}>Friend</span>
		</div>
	);
};

export const ADDButton = () => {
	return (
		<div className={classes.btnFriendADD}>
			<div className={classes.icon}>
				<Image src={AddFriend} />
			</div>
			<span className={classes.FriendADD}>Add Friend</span>
		</div>
	);
};

export const PendingButton = () => {
	return (
		<div className={classes.btnPending}>
			<div className={classes.PendingHover}>
				<Image src={Union} />
			</div>
			<span className={classes.PendingBTNHover}>Cancel</span>
			<div className={classes.PendingnotHover}>
				<Image src={Pending} />
			</div>
			<span className={classes.PendingBTN}>Pending</span>
		</div>
	);
};

export const OptionMenu:React.FC<{FirstBtn: string, SecondBtn: string, width: string}> = (props) => {
	return (
		<motion.div
			initial={{ scale: 0.5 }}
			animate={{ scale: 1 }}
			className={classes.optionMenu}
			style={{width:`${props.width}`}}
		>
			<div className={classes.itemListoption}>{props.FirstBtn}</div>
			<div className={classes.itemListoptionBlock}>{props.SecondBtn}</div>
		</motion.div>
	);
};

const User: React.FC<friendDataType> = (props) => {
	const [option, setOption] = useState(false);
	const TaggleHandler = () => setOption(!option);
	const [classBtn, setClassBtn] = useState(classes.friendvalue);
	const [classeBtnAfter, setClasseBtnAfter] = useState(classes.afterFriend);
	useEffect(() => {
		if (props.stat === "pending") setClassBtn(classes.pendingvalue);
		if (props.stat === "notFriend") setClassBtn(classes.notFriendvalue);
	}, [classBtn]);
	return (
		<div className={classes.friend}>
			<div className={classes.Avatar_name}>
				<div className={classes.avatar}>
					<Image src={props.Avatar} />
				</div>
				<div className={classes.friendName}>{props.fullName}</div>
			</div>
			<div className={classes.optionFriend}>
				{props.stat === "notFriend" && <ADDButton />}
				{props.stat === "pending" && <PendingButton />}
				{props.stat === "friend" && <FriendButton />}
				<div className={classes.optionsbtnctn} onClick={TaggleHandler}>
					<Image src={Option} />
					{option && (
						<OptionMenu FirstBtn="Direct message" SecondBtn="Block user" width="105px" />
						// <motion.div
						// 	initial={{ scale: 0.5 }}
						// 	animate={{ scale: 1 }}
						// 	className={classes.optionMenu}
						// >
						// 	<div className={classes.itemListoption}>
						// 		Direct message
						// 	</div>
						// 	<div className={classes.itemListoptionBlock}>
						// 		Block user
						// 	</div>
						// </motion.div>
					)}
				</div>
			</div>
		</div>
	);
};

const Search = () => {
	const router = useRouter();
	console.log(router.query.search);
	const Searchkey = router.query.search;
	return (
		<div className={classes.SearchCTN}>
			<motion.div className={classes.SearchCTNIN}>
				{/* <p className={classes.friendName}>Search About: {Searchkey}</p> */}
				<User fullName="Ayoub boulbaz" Avatar={profile} stat="friend" />
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="pending"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User fullName="Ayoub boulbaz" Avatar={profile} stat="friend" />
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="pending"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User fullName="Ayoub boulbaz" Avatar={profile} stat="friend" />
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="pending"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User fullName="Ayoub boulbaz" Avatar={profile} stat="friend" />
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="pending"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User fullName="Ayoub boulbaz" Avatar={profile} stat="friend" />
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="pending"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User fullName="Ayoub boulbaz" Avatar={profile} stat="friend" />
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="pending"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User fullName="Ayoub boulbaz" Avatar={profile} stat="friend" />
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="pending"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
			</motion.div>
		</div>
	);
};
export default Search;
