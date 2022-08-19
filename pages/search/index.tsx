import { motion } from "framer-motion";
import classes from "../../styles/Search.module.css";
import Image from "next/image";
import profile from "../../public/profileImage.png";
import Union from "../../public/FriendIcons/Union.svg";
import Friend from "../../public/FriendIcons/FriendIcon.svg";
import Option from "../../public/FriendIcons/OptionIcon.svg";
import Pending from "../../public/FriendIcons/Pending.svg";
import AddFriend from "../../public/FriendIcons/ADDFriend.svg";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../components/store/hooks";
import { addFriend, selectUser } from "../../components/store/userSlice";
import { useOutsideAlerter } from "../../components/profile/ProfileInfoEdit";

interface friendDataType {
	Avatar: any;
	fullName: string;
	stat: string;
}

export const FriendButton = (props: { remove: (act: string) => void }) => {
	const handler = () => props.remove("remove");
	return (
		<div className={classes.btnfriend} onClick={handler}>
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

export const ADDButton = (props: { add: (act: string) => void }) => {
	const handler = () => props.add("add");
	return (
		<div className={classes.btnFriendADD} onClick={handler}>
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

export const OptionMenu: React.FC<{
	FirstBtn: string;
	SecondBtn: string;
	width: string;
	ref_cmp: React.MutableRefObject<null>;
}> = (props) => {
	return (
		<motion.div
			ref={props.ref_cmp}
			initial={{ scale: 0.5 }}
			animate={{ scale: 1 }}
			className={classes.optionMenu}
			style={{ width: `${props.width}` }}
		>
			<div className={classes.itemListoption} onClick={alert}>{props.FirstBtn}</div>
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
	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef, setOption);
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
				<div className={classes.optionsbtnctn} onClick={TaggleHandler} >
					<Image src={Option} />
					{option && (
						<OptionMenu
							ref_cmp={wrapperRef}
							FirstBtn="Direct message"
							SecondBtn="Block user"
							width="9rem"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

const Search = () => {
	const router = useRouter();
	// console.log(router.query.search);
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
