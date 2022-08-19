import ProfileInfo from "../../components/profile/profileInfo";
import Achievements from "../../components/profile/achievements";
import OverView from "../../components/profile/overView";
import MatchHistory from "../../components/profile/MatchHistory";
import { selectUser } from "../../components/store/userSlice";
import { useSelector } from "react-redux";

const Profile = () => {
	return (
		<>
			<ProfileInfo />
			<Achievements />
			<OverView />
			<MatchHistory />
		</>
	);
};
export default Profile;
