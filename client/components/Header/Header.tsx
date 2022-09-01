import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import classes from "../../styles/Header.module.css";
import Image from "next/image";
import Search from "../../public/SearchIcon.svg";
import Notification from "../../public/Notification.svg";
import DownArrow from "../../public/Caret down.svg";
import { useRouter } from "next/router";
import { useAppDispatch } from "../store/hooks";

import { ShowSettings, Toggle } from "../store/UI-Slice";
import { useOutsideAlerter } from "../Settings/ProfileInfoEdit";
import axios from "axios";
import { motion } from "framer-motion";
import { LogOut } from "../../customHooks/useFetchData";
import { baseUrl, eraseCookie } from "../../config/baseURL";
import { getCookie } from "cookies-next";
import { UserTypeNew } from "../../Types/dataTypes";

const UserSection = () => {
	const menu = useRef(null);
	const router = useRouter();
	const notifMenu = useRef(null);
	const dispatch = useAppDispatch();
	const [dropDown, setDropDown] = useState(false);
	const [UserData, setUserData] = useState<UserTypeNew>(new UserTypeNew());
	const ClickHandler = () => setDropDown((value) => !value);
	const token = getCookie("jwt");

	const [isOpen, setisOpen] = useState(false);
	const clicknotifHandler = () => {
		setisOpen((value) => !value);
	};
	const toggleHandler = () => {
		dispatch(Toggle());
		ClickHandler();
	};
	const toggleSettingHandler = () => {
		dispatch(ShowSettings());
		ClickHandler();
	};
	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${baseUrl}user/header`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
					withCredentials: true,
				})
				.then((res) => {
					setUserData(res.data);
				})
				.catch((err) => {
					eraseCookie("jwt");
					router.replace("/");
				});
		};
		if (!UserData?.fullname) fetchData();
	}, []);
	useOutsideAlerter(notifMenu, setisOpen);
	useOutsideAlerter(menu, setDropDown);

	const LogOutHandler = () => LogOut(router);
	return (
		<>
			<div
				className={classes.NotifIcon}
				ref={notifMenu}
				onClick={clicknotifHandler}
			>
				<div className={classes.dot} />
				<Image src={Notification} />
				{isOpen && (
					<motion.div
						id="notifmenu"
						initial={{ scale: 0.5 }}
						animate={{ scale: 1 }}
						className={classes.ctnNotif}
					>
						<span className={classes.notif}>
							<span className={classes.notifTitle}>
								Friend Request
							</span>
							abdellah want to be your friend
						</span>
						<span className={classes.notif}>
							<span className={classes.notifTitle}>
								Challenge Request
							</span>
							abdellah Invite you to play pong game
						</span>
						<span className={classes.notif}>
							<span className={classes.notifTitle}>
								Friend Request
							</span>
							ayoub want to be your friend
						</span>
						<span className={classes.notif}>
							<span className={classes.notifTitle}>
								Challenge Request
							</span>
							younes Invite you to play pong game
						</span>
					</motion.div>
				)}
			</div>
			<div
				ref={menu}
				className={classes.avatarContainer}
				onClick={ClickHandler}
			>
				<img src={UserData?.avatar} className={classes.avatar} />
				<p className={classes.userName}>{UserData?.fullname}</p>
				<Image src={DownArrow} width={24} height={24} />
				{dropDown && (
					<motion.div
						initial={{ scale: 0.5 }}
						animate={{ scale: 1 }}
						className={classes.DropDown}
					>
						<div className={classes.EditP} onClick={toggleHandler}>
							Edit profile
						</div>
						<div
							className={classes.EditP}
							onClick={toggleSettingHandler}
						>
							Settings
						</div>
						<div className={classes.LogOut} onClick={LogOutHandler}>
							Log out
						</div>
					</motion.div>
				)}
			</div>
		</>
	);
};

const Header: React.FC<{ setPos: (page: string) => void }> = (props) => {
	const input = useRef(null);
	const router = useRouter();
	const searchHanler: FormEventHandler = (e) => {
		let current: any = input.current;
		e.preventDefault();
		props.setPos("hide");
		router.push({
			pathname: "/search",
			query: { search: `${current.value}` },
		});
	};
	useEffect(() => {
		let current: any = input.current;
		current.value = router.query.data ? router.query.data : "";
	}, [input]);

	return (
		<div className={classes.topBar}>
			<div className={classes.tmpctn}>
				<div className={classes.inputContainer}>
					<div className={classes.searchIcon}>
						<Image src={Search} />
					</div>
					<form className={classes.form} onSubmit={searchHanler}>
						<input
							ref={input}
							type="text"
							className={classes.searchInput}
							placeholder="Search"
						/>
					</form>
				</div>
				<UserSection />
			</div>
		</div>
	);
};

export default Header;
