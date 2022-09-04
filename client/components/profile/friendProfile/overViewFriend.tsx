import classes from "../../../styles/overView.module.css";
import { motion } from "framer-motion";
import "react-sweet-progress/lib/style.css";
import React from "react";
import LeaderBoard from "../OverView/LeaderBord";

const OverViewFriend: React.FC<{id: string}> = () => {
	return (
		<div className={classes.overviewCtn}>
			<div>
				<div className={classes.navView}>
					<div
						className={`${classes.TitleOverView}  ${classes.overViewbtn}`}
					>
						Overview
					</div>
				</div>
				<div className={classes.ctnIndic}>
					<motion.div
						exit={{ opacity: 0 }}
						animate="animate"
						className={classes.Indic}
					></motion.div>
				</div>
			</div>
			<div className={classes.overview}>
				<LeaderBoard />
			</div>
		</div>
	);
};

export default OverViewFriend;
