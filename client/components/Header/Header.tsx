import React, { FormEventHandler, useEffect, useRef, useState } from "react"
import classes from "../../styles/Header.module.css"
import Image from "next/image"
import Search from "../../public/SearchIcon.svg"
import Notification from "../../public/Notification.svg"
import DownArrow from "../../public/Caret down.svg"
import { useRouter } from "next/router"
import { getImageBySize, useOutsideAlerter } from "../../customHooks/Functions"
import { motion, Variants } from "framer-motion"
import { fetchDATA, LogOut, requests } from "../../customHooks/useFetchData"
import { EmtyUser, NotificationType, UserTypeNew } from "../../Types/dataTypes"
import socket_notif from "../../config/socketNotif"
import { ShowSettings, Toggle } from "@store/UI-Slice"
import socket_game from "config/socketGameConfig"
import { useDispatch } from "react-redux"

const Notif_item: React.FC<NotificationType> = (props) => {
	const [isOpen, setIsOpen] = useState(false)
	const router = useRouter()
	const clickHandler = () => {
		if (props.status === "Sent") setIsOpen((prev1) => !prev1)
	}
	const owner = localStorage.getItem("owner")
	const acceptHandler = async () => {
		if (props.type.includes("Request")) {
			await requests(props.login, "friendship/acceptRequest", router)
			props.refresh()
		} else if (props.type.includes("Game")) {
			socket_game.emit("joinGameFriend", { login: owner, accept: props.gameId }, (data: string) => {
				if (data.length > 4) {
					socket_notif.emit("updateGame", { notifId: props.notifId, status: "Accepted" })
					router.push("/game/lobby?gameID=" + data)
					props.refresh()
				}
			})
		}
	}
	const refuseHandler = async () => {
		if (props.type.includes("Request")) {
			await requests(props.login, "friendship/refuseRequest", router)
			props.refresh()
		} else if (props.type.includes("Game")) {
			socket_notif.emit("updateGame", { notifId: props.notifId, status: "Refused" }, () => {
				props.refresh()
				socket_game.emit("refuseChallenge", props.gameId)
			})
		}
	}
	const avatarPath = getImageBySize(props.avatar, 70)
	const itemVariants: Variants = {
		open: {
			height: "100%",
			opacity: 1,
		},
		closed: {
			height: "0%",
			opacity: 0,
			display: "none",
		},
	}

	return (
		<>
			<div className={classes.notif}>
				<div className={classes.notifContent} onClick={clickHandler}>
					<div className={classes.avatar_notif}>
						<img src={avatarPath} alt={props.fullname} />
					</div>
					<div className={classes.nameAndcontent}>
						<h1>{props.fullname}</h1>
						<p className={props.status !== "Sent" ? classes.read : ""}>
							{props.type === "Request" ? "Send you a friend request" : "invites you for a pong game"}
						</p>
					</div>
				</div>
				{
					<>
						<motion.div
							className={classes.btnContainer}
							variants={itemVariants}
							animate={isOpen ? "open" : "closed"}>
							{isOpen && (
								<>
									<motion.span
										variants={itemVariants}
										animate={isOpen ? "open" : "closed"}
										onClick={refuseHandler}>
										Decline
									</motion.span>
									<motion.span
										onClick={acceptHandler}
										variants={itemVariants}
										animate={isOpen ? "open" : "closed"}>
										Accept
									</motion.span>
								</>
							)}
						</motion.div>
					</>
				}
			</div>
		</>
	)
}

const Notif: React.FC = () => {
	const [notification, setnotification] = useState<NotificationType[]>([])
	const [isOpen, setisOpen] = useState(false)
	const [isMounted, setisMounted] = useState(false)
	const [isNew, setisNew] = useState(false)
	const notifMenu = useRef(null)
	const ref_icon = useRef(null)
	const clicknotifHandler = (e: any) => {
		if (ref_icon.current && ref_icon.current == e.target) {
			setisOpen((value) => !value)
			socket_notif.emit("allRead")
		}
	}
	const refresh = () => {
		socket_notif.emit("getNotif", (data: any) => {
			const isfresh = data.data.find((notif: NotificationType) => notif.status === "Sent")
			if (isfresh) setisNew(true)
			else setisNew(false)
			if (data.data.length) setnotification(data.data)
			setisOpen(false)
		})
	}
	useOutsideAlerter(notifMenu, setisOpen)
	useEffect(() => {
		setisMounted(true)
		refresh()
		socket_notif.on("Notif", (data) => {
			if (data) {
				const isfresh = data.data.find((notif: NotificationType) => notif.status === "Sent")
				if (isfresh) setisNew(true)
				else setisNew(false)
				setnotification((old) => {
					if (!old.length) return [...data.data]
					return [...data.data, ...old]
				})
			}
		})
		return () => {
			socket_notif.off("Notif")
		}
	}, [])
	return (
		<>
			{isMounted && (
				<div className={classes.NotifIcon} ref={notifMenu} onClick={clicknotifHandler}>
					{isNew && <div className={classes.dot} />}
					<img src={Notification.src} ref={ref_icon} />
					{isOpen && (
						<motion.div
							id="notifmenu"
							initial={{ scale: 0.5 }}
							animate={{ scale: 1 }}
							className={classes.ctnNotif}>
							{(notification.length &&
								notification?.map((notif) => {
									return <Notif_item {...notif} key={Math.random()} refresh={refresh} />
								})) || (
								<span
									className={classes.notifTitle}
									style={{
										fontSize: "1.4rem",
										padding: ".5rem",
									}}>
									No Notification
								</span>
							)}
						</motion.div>
					)}
				</div>
			)}
		</>
	)
}

const UserSection = () => {
	const menu = useRef(null)
	const router = useRouter()
	const dispatch = useDispatch()
	const [dropDown, setDropDown] = useState(false)
	const [isMounted, setIsMounted] = useState(false)
	const [UserData, setUserData] = useState<UserTypeNew>(EmtyUser)
	const ClickHandler = () => setDropDown((value) => !value)

	const toggleHandler = () => {
		dispatch(Toggle())
		ClickHandler()
	}
	const toggleSettingHandler = () => {
		dispatch(ShowSettings())
		ClickHandler()
	}
	useEffect(() => {
		setIsMounted(true)
		fetchDATA(setUserData, router, "user/header")
		return () => {
			setUserData(EmtyUser)
		}
	}, [])
	useOutsideAlerter(menu, setDropDown)
	const LogOutHandler = () => LogOut(router)
	const pathImage = getImageBySize(UserData?.avatar, 70)
	return (
		<>
			{isMounted && (
				<>
					<div ref={menu} className={classes.avatarContainer} onClick={ClickHandler}>
						<img src={pathImage} className={classes.avatar} />
						<p className={classes.userName}>{UserData?.fullname}</p>
						<Image src={DownArrow} width={24} height={24} />
						{dropDown && (
							<motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className={classes.DropDown}>
								<div className={classes.EditP} onClick={toggleHandler}>
									Edit profile
								</div>
								<div className={classes.EditP} onClick={toggleSettingHandler}>
									Settings
								</div>
								<div className={classes.LogOut} onClick={LogOutHandler}>
									Log out
								</div>
							</motion.div>
						)}
					</div>
				</>
			)}
		</>
	)
}

const Header: React.FC<{ setPos: (page: string) => void }> = (props) => {
	const input = useRef(null)
	const router = useRouter()
	const searchHanler: FormEventHandler = (e) => {
		let current: any = input.current
		e.preventDefault()
		if (current.value !== "") {
			props.setPos("hide")
			router.push({
				pathname: "/search",
				query: { search: `${current.value}` },
			})
		}
	}
	useEffect(() => {
		let current: any = input.current
		current.value = router.query.data ? router.query.data : ""
	}, [input])

	useEffect(() => {
		// redirect to the game when started
		socket_game.connect()
		socket_game.on("gameStartedSoon", (props) => {
			if (props.check === true) {
				if (!router.asPath.includes("game/lobby?gameID=")) router.push("/game/lobby?gameID=" + props.id)
			}
		})
		return () => {
			socket_game.off("gameStartedSoon")
		}
	}, [])

	return (
		<div className={classes.topBar}>
			<div className={classes.tmpctn}>
				<div className={classes.inputContainer}>
					<div className={classes.searchIcon}>
						<Image src={Search} />
					</div>
					<form className={classes.form} onSubmit={searchHanler}>
						<input ref={input} type="text" className={classes.searchInput} placeholder="Search" />
					</form>
				</div>
				<Notif />
				<UserSection />
			</div>
		</div>
	)
}

export default Header
