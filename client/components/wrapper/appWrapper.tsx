import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import classesNav from "../../styles/sideNav.module.css"
import classes from "../../styles/Profile.module.css"
import LoadingElm from "../loading/Loading_elm"
import Header from "../Header/Header"
import SideNav from "../Header/sideNav"
import Section from "../section"
import Setting from "../Settings/settings"
import ProfileInfoEdit from "../Settings/ProfileInfoEdit"
import { useDispatch, useSelector } from "react-redux"
import {
	HideErrorGameMsg,
	HideErrorMsg,
	Settings,
	Toggle,
	ToggleErrorGameValue,
	ToggleErrorValue,
	ToggleValue,
} from "../../store/UI-Slice"
import { fetchDATA } from "../../customHooks/useFetchData"
import socket_notif from "config/socketNotif"
import MsgSlideUp from "@components/Settings/slideUpMsg"

type PropsType = {
	children: JSX.Element
}

const ContentWrapper: React.FC<PropsType> = ({ children }) => {
	const [isAuth, setIsAuth] = useState(false)
	const displayCard = useSelector(ToggleValue)
	const displaymsg = useSelector(Settings)
	const dispatch = useDispatch()
	const router = useRouter()
	const [posIndicator, setPosIndicator] = useState(classesNav.hide)
	const ShowError = useSelector(ToggleErrorValue)
	const ShowErrorGame = useSelector(ToggleErrorGameValue)
	const Path = router.asPath;
	if (ShowError) {
		const timer = () => {
			const id = setTimeout(() => {
				dispatch(HideErrorMsg())
				return () => {
					clearTimeout(id)
				}
			}, 3000)
			return () => clearTimeout(id)
		}
		timer()
	}
	if (ShowErrorGame) {
		const timer = () => {
			const id = setTimeout(() => {
				dispatch(HideErrorGameMsg())
				return () => {
					clearTimeout(id)
				}
			}, 3000)
			return () => clearTimeout(id)
		}
		timer()
	}
	const navBarHandler = (page: string) => {
		setPosIndicator(() => {
			if (page.includes("/profile")) return classesNav.profilePos
			if (page.includes("/live-games")) return classesNav.liveGamePos
			if (page.includes("/game")) return classesNav.gamePos
			if (page.includes("/chat")) return classesNav.chatPos
			return classesNav.hide
		})
	}
	useEffect(() => {
		fetchDATA(setIsAuth, router, "auth/isAuthorized")
	}, [])
	useEffect(() => {
		navBarHandler(Path)
	}, [Path])
	if (!socket_notif.id) socket_notif.on("connect", () => {})
	if (!isAuth)
		return <LoadingElm />
	const toggleHandler = () => dispatch(Toggle())

	return (
		<>
			{ShowError && <MsgSlideUp msg="User Not Found" colorCtn="#FF6482" colorMsg="#ECF5FF" />}
			{ShowErrorGame && <MsgSlideUp msg="invitation is already sent" colorCtn="#FF6482" colorMsg="#ECF5FF" />}
			{displaymsg && <Setting />}
			{displayCard && <ProfileInfoEdit setTagle={toggleHandler} />}
			<Header setPos={navBarHandler} />
			<SideNav currentPos={posIndicator} />
			<Section
				elm={
					<>
						{children}
						<div className={classes.buttom}></div>
					</>
				}
			/>
		</>
	)
}

export default ContentWrapper
