import classes from "../../styles/overView.module.css";

import { motion } from "framer-motion";
import "react-sweet-progress/lib/style.css";

import React, { useState } from "react";

import FriendProfileList from "./FriendProfileList";
import LeaderBoard from "./LeaderBord";
// import Message from ''


interface TYPEOVERVIEW {
	me: boolean
}

const OverView:React.FC<TYPEOVERVIEW> = (props) => {
	const [overViewShow, setOverViewShow] = useState(true);

	const showOverView = () => {
		setOverViewShow(true);
	};
	const hideOverView = () => setOverViewShow(false);
	let underLineOverView = overViewShow ? classes.overViewbtn : " ";
	let underLinefriends = !overViewShow ? classes.FriendsBtn : " ";
	let classesIndic = (!overViewShow && classes.IndicFriend) || classes.Indic;
	return (
		<div className={classes.overviewCtn}>
			<div>
				<div className={classes.navView}>
					<div
						className={`${classes.TitleOverView}  ${underLineOverView}`}
						onClick={showOverView}
					>
						Overview
					</div>
					{props.me && <div
						className={`${classes.TitleOverView} ${underLinefriends} `}
						onClick={hideOverView}
					>
						Friends
					</div>}
				</div>
				<div className={classes.ctnIndic}>
					<motion.div
						exit={{ opacity: 0 }}
						animate="animate"
						className={classesIndic}
					></motion.div>
				</div>
			</div>
			<div className={classes.overview}>
				{overViewShow && <LeaderBoard />}
				{!overViewShow && <FriendProfileList />}
			</div>
		</div>
	);
};

export default OverView;
