import classes from "../../styles/Search.module.css";
import Image from "next/image";
import Option from "../../public/FriendIcons/OptionIcon.svg";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useOutsideAlerter } from "../../customHooks/Functions";
import ContentWrapper from "../../components/wrapper/appWrapper";
import SearchComponent from "../../components/search/search";
import { ADDButton, FriendButton, OptionMenu, PendingButton } from "../../components/buttons";

interface friendDataType {
	Avatar: any;
	fullName: string;
	stat: string;
}

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
				<div
					className={classes.optionsbtnctn}
					onClick={TaggleHandler}
					ref={wrapperRef}
				>
					<Image src={Option} />
					{option && (
						<OptionMenu
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
		<ContentWrapper children={
			<SearchComponent />
		} />
		// <Skeleton
		// 	elm={
		// 		<div className={classes.SearchCTN}>
		// 			<motion.div className={classes.SearchCTNIN}>
		// 				{/* <p className={classes.friendName}>Search About: {Searchkey}</p> */}
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="friend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="pending"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="notFriend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="friend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="pending"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="notFriend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="friend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="pending"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="notFriend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="friend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="pending"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="notFriend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="friend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="pending"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="notFriend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="friend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="pending"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="notFriend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="friend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="pending"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="notFriend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="notFriend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="notFriend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="notFriend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="notFriend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="notFriend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="notFriend"
		// 				/>
		// 				<User
		// 					fullName="Ayoub boulbaz"
		// 					Avatar={profile}
		// 					stat="notFriend"
		// 				/>
		// 			</motion.div>
		// 		</div>
		// 	}
		// />
	);
};
export default Search;
