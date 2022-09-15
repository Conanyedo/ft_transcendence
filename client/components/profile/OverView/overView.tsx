import classes from "../../../styles/overView.module.css";

import { motion } from "framer-motion";
import "react-sweet-progress/lib/style.css";

import React, { useState } from "react";

import FriendProfileList from "./FriendProfileList";
import LeaderBoard from "./LeaderBord";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/userSlice";
// import Message from ''

const OverView: React.FC = () => {
	const rout = useRouter();
	const [overViewShow, setOverViewShow] = useState(true);
	const [showFriend, setShowFriend] = useState(rout.query.id === undefined);
	const user = useSelector(selectUser);

	const showOverView = () => {
		setOverViewShow(true);
	};

	const hideOverView = () => setOverViewShow(false);
	let underLineOverView = overViewShow ? classes.overViewbtn : " ";
	let underLinefriends = !overViewShow ? classes.FriendsBtn : " ";
	let classesIndic = (!overViewShow && classes.IndicFriend) || classes.Indic;
	return (
		<div className={classes.overviewCtn}>
			<div className={classes.navView}>
				<div
					className={`${classes.TitleOverView}  ${underLineOverView}`}
					onClick={showOverView}
				>
					Overview
				</div>
				<div
					className={`${classes.TitleOverView} ${underLinefriends} `}
					onClick={hideOverView}
				>
					Friends
				</div>
			</div>
			<div className={classes.ctnIndic}>
				<motion.div
					// exit={{ opacity: 0 }}
					animate="animate"
					className={classesIndic}
				></motion.div>
			</div>
			<div className={classes.overview} style={{ paddingBottom: "0" }}>
				{overViewShow && <LeaderBoard />}
				{!overViewShow && <FriendProfileList />}
			</div>
		</div>
	);
};

export default OverView;
