import ProfileInfo from "../../components/profile/profileInfo";
import Achievements from "../../components/profile/achievements";
import OverView from "../../components/profile/overView";
import MatchHistory from "../../components/profile/MatchHistory";

import classes from "../../styles/Profile.module.css";

const Profile = () => {
	return (
		<div className={classes.profileCtn}>
			<ProfileInfo />
			<Achievements />
			<OverView />
			<MatchHistory />
			<div className={classes.buttom}></div>
		</div>
	);
};
export default Profile;
