import ProfileInfo from "../../components/profile/profileInfo";
import Achievements from "../../components/profile/achievements";
import OverView from "../../components/profile/OverView/overView";
import MatchHistory from "../../components/profile/MatchHistory";

import classes from "../../styles/Profile.module.css";
import Skeleton from "../../components/skeleton";
import ContentWrapper from "../../components/wrapper/appWrapper";

const Profile = () => {
	const id = 1001;
	return (
		<ContentWrapper
			children={
				<div className={classes.profileCtn}>
					<ProfileInfo />
					<Achievements id={id} />
					<OverView id={id} />
					<MatchHistory id={id} />
					<div className={classes.buttom}></div>
				</div>
			}
		/>
	);
};
export default Profile;
