import classes from "../../../styles/FriendList.module.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Router, { useRouter } from "next/router";

import Message from "../../../public/ChatIcon.svg";
import Options from "../../../public/LeaderBoard/Options.svg";
import LiveGameSelected from "../../../public/FriendIcons/LiveGameFriend.svg";
import { getImageBySize, useOutsideAlerter } from "../../../customHooks/Functions";
import { fetchDATA, requests } from "../../../customHooks/useFetchData";
import { UserTypeNew } from "../../../Types/dataTypes";
import LoadingElm from "../../loading/Loading_elm";
import { OptionMenu } from "../../buttons";
import socket_game from "config/socketGameConfig";

class types extends UserTypeNew {
	refresh: any
}

const Friend: React.FC<types> = (props) => {
	const [optionTaggle, setoptionTaggle] = useState(false);
	const wrapperRef = useRef(null);
	const profileFriendHandler = () => Router.push("/profile/" + props.login);
	const optionTaggleHandler = () => setoptionTaggle(!optionTaggle);
	const unfriendHandler = async () =>{
		await requests(props.login, "friendship/unfriend", Router);
		props.refresh();
	}
	const BlockHandler = async () => {
		await requests(props.login, "friendship/blockUser", Router);
		props.refresh();
	}
	const goToChat = () => {
		if (props.status === 'In Game') {
			socket_game.emit('getGameId', props.login, (data: string) => {
				Router.push("/live-games/" + data);
			})
		} else
			Router.push("/chat?login=" + props.login);
	};
	useOutsideAlerter(wrapperRef, setoptionTaggle);
	const pathImage = getImageBySize(props.avatar, 70);
	return (
		<div className={classes.friend}>
			<div className={classes.Avatar_name}>
				<div className={classes.avatar}>
					<img src={pathImage} />
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
				<div
					className={`${classes.sendMsg} ${classes.hideMsgBtn}`}
					onClick={goToChat}
				>
					{props.status === 'In Game' &&
					<Image src={LiveGameSelected} width="100" height="100" /> ||
					<Image src={Message} width="100" height="100" />}
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
							firstClick={unfriendHandler}
							SecondClick={BlockHandler}
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
	const refresh = () => fetchDATA(setListFriend, router, "friendship/friends");
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
			<div className={classes.listFriends} ref={wrapperRef}>
				{(listFriend?.length &&
					listFriend.map((friend) => {
						if (props.search === "")
							return <Friend {...friend} key={Math.random()} refresh={refresh}/>;
						else if (
							friend.fullname
								.toLocaleLowerCase()
								.includes(props.search.toLocaleLowerCase())
						)
							return <Friend {...friend} key={Math.random()} refresh={refresh}/>;
					})) || (
					<div className={classes.noFriends}>No Friend Yet</div>
				)}
			</div>
		</>
	);
};

export default ListFriends;
