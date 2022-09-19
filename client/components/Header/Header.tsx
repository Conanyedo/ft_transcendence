import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import classes from "../../styles/Header.module.css";
import Image from "next/image";
import Search from "../../public/SearchIcon.svg";
import Notification from "../../public/Notification.svg";
import DownArrow from "../../public/Caret down.svg";
import Router, { useRouter } from "next/router";
import { getImageBySize, useOutsideAlerter } from "../../customHooks/Functions";
import { motion } from "framer-motion";
import { fetchDATA, LogOut } from "../../customHooks/useFetchData";
import { EmtyUser, NotificationType, UserTypeNew } from "../../Types/dataTypes";
import { getCookie } from "cookies-next";
import socket_notif from "../../config/socketNotif";
import { useAppDispatch } from "@store/hooks";
import { ShowSettings, Toggle } from "@store/UI-Slice";

let len = 0;
const Notif: React.FC = () => {
	const [notification, setnotification] = useState<NotificationType[] | null>(
		null
	);
	const [isOpen, setisOpen] = useState(false);
	const [isMounted, setisMounted] = useState(false);
	const [isNew, setisNew] = useState(false);
	const notifMenu = useRef(null);
	const token = getCookie("jwt");
	const clicknotifHandler = () => {
		socket_notif.emit("allRead");
		setisOpen((value) => !value);
	};
	useOutsideAlerter(notifMenu, setisOpen);
	useEffect(() => {
		setisMounted(true);
		socket_notif.emit("getNotif");
		socket_notif.on("Notif", (data) => {
			if (data) {
				const isfresh = data.find(
					(notif: NotificationType) => notif.read === false
				);
				if (isfresh) setisNew(true);
				else setisNew(false);
				data = data.reverse();
				setnotification(data);
			}
		});
		return (() => {
			socket_notif.off('Notif');
		})
	}, []);
	return (
		<>
			{isMounted && (
				<div
					className={classes.NotifIcon}
					ref={notifMenu}
					onClick={clicknotifHandler}
				>
					{isNew && <div className={classes.dot} />}
					<Image src={Notification} />
					{isOpen && (
						<motion.div
							id="notifmenu"
							initial={{ scale: 0.5 }}
							animate={{ scale: 1 }}
							className={classes.ctnNotif}
						>
							{(notification &&
								notification?.map((notif) => {
									return (
										<span
											className={classes.notif}
											key={Math.random()}
											onClick={() =>
												Router.push(
													"/profile/" + notif?.login
												)
											}
										>
											<span
												className={classes.notifTitle}
											>
												{notif?.msg === "Request"
													? "Friend Request"
													: "Game Challenge"}
											</span>
											{notif?.login}
											{notif?.msg === "Request"
												? " want to be your friend"
												: " invited you to play pong game"}
										</span>
									);
								})) || (
								<span
									className={classes.notifTitle}
									style={{
										fontSize: "1.4rem",
										padding: ".5rem",
									}}
								>
									No Notification
								</span>
							)}
						</motion.div>
					)}
				</div>
			)}
		</>
	);
};

const UserSection = () => {
	const menu = useRef(null);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [dropDown, setDropDown] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [UserData, setUserData] = useState<UserTypeNew>(EmtyUser);
	const ClickHandler = () => setDropDown((value) => !value);

	const toggleHandler = () => {
		dispatch(Toggle());
		ClickHandler();
	};
	const toggleSettingHandler = () => {
		dispatch(ShowSettings());
		ClickHandler();
	};
	useEffect(() => {
		setIsMounted(true);
		fetchDATA(setUserData, router, "user/header");
		return (() => {
			setUserData(EmtyUser);
		})
	}, []);
	useOutsideAlerter(menu, setDropDown);
	const LogOutHandler = () => LogOut(router);
	const pathImage = getImageBySize(UserData?.avatar, 70);
	return (
		<>
			{isMounted && (
				<>
					<div
						ref={menu}
						className={classes.avatarContainer}
						onClick={ClickHandler}
					>
						<img src={pathImage} className={classes.avatar} />
						<p className={classes.userName}>{UserData?.fullname}</p>
						<Image src={DownArrow} width={24} height={24} />
						{dropDown && (
							<motion.div
								initial={{ scale: 0.5 }}
								animate={{ scale: 1 }}
								className={classes.DropDown}
							>
								<div
									className={classes.EditP}
									onClick={toggleHandler}
								>
									Edit profile
								</div>
								<div
									className={classes.EditP}
									onClick={toggleSettingHandler}
								>
									Settings
								</div>
								<div
									className={classes.LogOut}
									onClick={LogOutHandler}
								>
									Log out
								</div>
							</motion.div>
						)}
					</div>
				</>
			)}
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
				<Notif />
				<UserSection />
			</div>
		</div>
	);
};

export default Header;
