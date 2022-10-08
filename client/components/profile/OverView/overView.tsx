import classes from "../../../styles/overView.module.css"
import { motion } from "framer-motion"
import "react-sweet-progress/lib/style.css"
import React, { useEffect, useState } from "react"
import FriendProfileList from "./FriendProfileList"
import LeaderBoard from "./LeaderBord"

const OverView: React.FC = () => {
	const [overViewShow, setOverViewShow] = useState(true)
	const [isMounted, setisMounted] = useState(true)

	const showOverView = () => {
		setOverViewShow(true)
	}
	useEffect(() => {
		setisMounted(true)
	}, [])
	const hideOverView = () => setOverViewShow(false)
	let underLineOverView = overViewShow ? classes.overViewbtn : " "
	let underLinefriends = !overViewShow ? classes.FriendsBtn : " "
	let classesIndic = (!overViewShow && classes.IndicFriend) || classes.Indic
	return (
		<>
			{isMounted && (
				<div className={classes.overviewCtn}>
					<div className={classes.navView}>
						<div className={`${classes.TitleOverView}  ${underLineOverView}`} onClick={showOverView}>
							Overview
						</div>
						<div className={`${classes.TitleOverView} ${underLinefriends} `} onClick={hideOverView}>
							Friends
						</div>
					</div>
					<div className={classes.ctnIndic}>
						<motion.div animate="animate" className={classesIndic}></motion.div>
					</div>
					<div className={classes.overview} style={{ paddingBottom: "0" }}>
						{overViewShow && <LeaderBoard />}
						{!overViewShow && <FriendProfileList />}
					</div>
				</div>
			)}
		</>
	)
}

export default OverView
