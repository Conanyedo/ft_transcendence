import ProfileInfo from "../../components/profile/profileInfo";
import Achievements from "../../components/profile/achievements";
import OverView from "../../components/profile/OverView/overView";
import MatchHistory from "../../components/profile/MatchHistory";
import classes from "../../styles/Profile.module.css";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { Toggle } from "@store/UI-Slice";
import { eraseCookie } from "@hooks/Functions";

const Profile = () => {
	const dispatch = useDispatch();
	const firstTime = getCookie("isFirst");
	if (firstTime) {
		dispatch(Toggle());
		eraseCookie('isFirst');
	}
	return (
		<div className={classes.profileCtn}>
			<ProfileInfo />
			<Achievements id="" />
			<OverView />
			<MatchHistory />
		</div>
	);
};
export default Profile;
