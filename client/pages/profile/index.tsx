import ProfileInfo from "../../components/profile/profileInfo";
import Achievements from "../../components/profile/achievements";
import OverView from "../../components/profile/OverView/overView";
import MatchHistory from "../../components/profile/MatchHistory";

import classes from "../../styles/Profile.module.css";
import ContentWrapper from "../../components/wrapper/appWrapper";

const Profile = () => {
	const id = 1001;
	const login = '';
	return (
				<div className={classes.profileCtn}>
					<ProfileInfo />
					<Achievements id="" />
					<OverView />
					<MatchHistory />
					<div className={classes.buttom}></div>
				</div>
	);
};
export default Profile;
