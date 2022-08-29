import ProfileInfo from "../../components/profile/profileInfo";
import Achievements from "../../components/profile/achievements";
import OverView from "../../components/profile/overView";
import MatchHistory from "../../components/profile/MatchHistory";

import classes from "../../styles/Profile.module.css";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
	const id = 1001;
	return (
		<>
			<div className={classes.profileCtn}>
				<ProfileInfo />
				<Achievements id={id} />
				<OverView id={id} />
				<MatchHistory id={id} />
				<div className={classes.buttom}></div>
			</div>
		</>
	);
};
export default Profile;
