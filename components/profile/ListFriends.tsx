import classes from "../../styles/FriendList.module.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { ReactEventHandler, useEffect, useRef, useState } from "react";
import Router from "next/router";


import Message from "../../public/SelectedSideNav/ChatSelected.svg";
import Options from "../../public/LeaderBoard/Options.svg";
import profile from "../../public/profileImage.png";
import { OptionMenu } from "../../pages/search";


let hideList = `${classes.listOptions} ${classes.hideListOption}`;

const ListFriends = () => {
	const profileFriendHandler = () => {
		Router.push("/profile/505");
	};

	const [optionTaggle, setoptionTaggle] = useState(false);
	function useOutsideAlerter(ref: any) {
		useEffect(() => {
			function handleClickOutside(event: any) {
				if (ref.current && !ref.current.contains(event.target)) {
					setoptionTaggle(false);
					// console.log(event.target);
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
		setoptionTaggle(false);
	};
	const optionTaggleHandler = () => setoptionTaggle(!optionTaggle);

	return (
		<div className={classes.listFriends} ref={wrapperRef}>
			<div className={classes.friend}>
				<div className={classes.Avatar_name}>
					<div className={classes.avatar}>
						<Image src={profile} />
					</div>
					<div
						className={classes.friendName}
						onClick={profileFriendHandler}
					>
						Anass Elmqas
					</div>
				</div>
				<div className={classes.statusFriend}>In Game</div>
				<div className={classes.optionFriend}>
					<div className={`${classes.sendMsg} ${classes.hideMsgBtn}`}>
						<Image src={Message} />
					</div>
					<div
						className={`${classes.sendMsg} ${classes.optionsbtnctn}`}
						onClick={optionTaggleHandler}
					>
						<Image src={Options} />
						{optionTaggle && (
							<OptionMenu FirstBtn="Unfriend" SecondBtn="Block user" width="76px" />
							// <motion.div
							// 	initial={{ scale: 0.5 }}
							// 	animate={{ scale: 1 }}
							// 	className={`${hideList}`}
							// >
							// 	<div className={classes.itemListoption}>
							// 		Unfriend
							// 	</div>
							// 	<div className={classes.itemListoptionBlock}>
							// 		Block user
							// 	</div>
							// </motion.div>
						)}
					</div>
				</div>
			</div>
			<div className={classes.friend}>
				<div className={classes.Avatar_name}>
					<div className={classes.avatar}>
						<Image src={profile} />
					</div>
					<div className={classes.friendName}>Anass Elmqas</div>
				</div>
				<div className={classes.statusFriend}>In Game</div>
				<div className={classes.optionFriend}>
					<div className={`${classes.sendMsg} ${classes.hideMsgBtn}`}>
						<Image src={Message} />
					</div>
					<div className={classes.sendMsg}>
						<Image src={Options} />
					</div>
				</div>
			</div>
			<div className={classes.friend}>
				<div className={classes.Avatar_name}>
					<div className={classes.avatar}>
						<Image src={profile} />
					</div>
					<div className={classes.friendName}>Anass Elmqas</div>
				</div>
				<div className={classes.statusFriend}>In Game</div>
				<div className={classes.optionFriend}>
					<div className={`${classes.sendMsg} ${classes.hideMsgBtn}`}>
						<Image src={Message} />
					</div>
					<div className={classes.sendMsg}>
						<Image src={Options} />
					</div>
				</div>
			</div>
			<div className={classes.friend}>
				<div className={classes.Avatar_name}>
					<div className={classes.avatar}>
						<Image src={profile} />
					</div>
					<div className={classes.friendName}>Anass Elmqas</div>
				</div>
				<div className={classes.statusFriend}>In Game</div>
				<div className={classes.optionFriend}>
					<div className={`${classes.sendMsg} ${classes.hideMsgBtn}`}>
						<Image src={Message} />
					</div>
					<div className={classes.sendMsg}>
						<Image src={Options} />
					</div>
				</div>
			</div>
			<div className={classes.friend}>
				<div className={classes.Avatar_name}>
					<div className={classes.avatar}>
						<Image src={profile} />
					</div>
					<div className={classes.friendName}>Anass Elmqas</div>
				</div>
				<div className={classes.statusFriend}>In Game</div>
				<div className={classes.optionFriend}>
					<div className={`${classes.sendMsg} ${classes.hideMsgBtn}`}>
						<Image src={Message} />
					</div>
					<div className={classes.sendMsg}>
						<Image src={Options} />
					</div>
				</div>
			</div>
			<div className={classes.friend}>
				<div className={classes.Avatar_name}>
					<div className={classes.avatar}>
						<Image src={profile} />
					</div>
					<div className={classes.friendName}>Anass Elmqas</div>
				</div>
				<div className={classes.statusFriend}>In Game</div>
				<div className={classes.optionFriend}>
					<div className={`${classes.sendMsg} ${classes.hideMsgBtn}`}>
						<Image src={Message} />
					</div>
					<div className={classes.sendMsg}>
						<Image src={Options} />
					</div>
				</div>
			</div>
			<div className={classes.friend}>
				<div className={classes.Avatar_name}>
					<div className={classes.avatar}>
						<Image src={profile} />
					</div>
					<div className={classes.friendName}>Anass Elmqas</div>
				</div>
				<div className={classes.statusFriend}>In Game</div>
				<div className={classes.optionFriend}>
					<div className={`${classes.sendMsg} ${classes.hideMsgBtn}`}>
						<Image src={Message} />
					</div>
					<div className={classes.sendMsg}>
						<Image src={Options} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ListFriends;
