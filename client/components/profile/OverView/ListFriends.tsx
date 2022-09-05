import classes from "../../../styles/FriendList.module.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Router, { useRouter } from "next/router";

import Message from "../../../public/ChatIcon.svg";
import Options from "../../../public/LeaderBoard/Options.svg";
import Search, { OptionMenu } from "../../../pages/search";
import { useOutsideAlerter } from "../../../customHooks/Functions";
import { fetchDATA } from "../../../customHooks/useFetchData";
import { UserTypeNew } from "../../../Types/dataTypes";
import LoadingElm from "../../loading/Loading_elm";

const Friend: React.FC<UserTypeNew> = (props) => {
	const profileFriendHandler = () => {
		Router.push("/profile/" + props.login);
	};

	const [optionTaggle, setoptionTaggle] = useState(false);

	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef, setoptionTaggle);

	const optionTaggleHandler = () => setoptionTaggle(!optionTaggle);

	return (
		<div className={classes.friend}>
			<div className={classes.Avatar_name}>
				<div className={classes.avatar}>
					<img src={props.avatar} />
				</div>
				<div
					className={classes.friendName}
					onClick={profileFriendHandler}
				>
					{props.fullname}
				</div>
			</div>
			<div className={classes.statusFriend}>{props.status}</div>
			<div className={classes.optionFriend}>
				<div className={`${classes.sendMsg} ${classes.hideMsgBtn}`}>
					<Image src={Message} width="100" height="100" />
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

const ListFriends: React.FC<{ search: string }> = (props) => {
	const [listFriend, setListFriend] = useState<UserTypeNew[] | null>(null);
	const wrapperRef = useRef(null);
	const [isUp, SetIsUp] = useState(false);
	const router = useRouter();
	useEffect(() => {
		fetchDATA(setListFriend, router, "friendship/friends");
		SetIsUp(true);
		return () => {
			setListFriend(null);
		};
	}, []);
	if (!isUp) {
		return (
			<div className={classes.listFriends}>
				<LoadingElm />
			</div>
		);
	}
	return (
		<>
			{isUp && (
				<div className={classes.listFriends} ref={wrapperRef}>
					{listFriend?.length && listFriend.map((friend) => {
						if (props.search === '')
							return <Friend {...friend} key={Math.random()} />
						else if (friend.fullname.includes(props.search))
							return <Friend {...friend} key={Math.random()} />
					})}
				</div>
			)}
		</>
	);
};

export default ListFriends;
