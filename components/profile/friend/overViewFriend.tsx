// import classes from "../../styles/overView.module.css";
import classes from "../../../styles/overView.module.css";

import { motion } from "framer-motion";
import "react-sweet-progress/lib/style.css";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LeaderBoard from "../LeaderBord";
import axios from "axios";
// import Message from ''

const OverViewFriend: React.FC = () => {
	const rout = useRouter();
	if (!rout.query.id) rout.replace("/");
	const [user, setuser] = useState();
	const fetchData = async (id: number) => {
		const data = await axios
			.get(`https://test-76ddc-default-rtdb.firebaseio.com/${id}.json`)
			.then((res) => {
				setuser(res.data);
			});
	};
	useEffect(() => {
		fetchData(Number(rout.query.id));
	}, []);
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
				{user && <LeaderBoard owner={user} />}
			</div>
		</div>
	);
};

export default OverViewFriend;
