
import Achievements from "../../../components/profile/achievements";
import MatchHistory from "../../../components/profile/MatchHistory";
import OverView from "../../../components/profile/overView";
import ProfileInfo from "../../../components/profile/profileInfo";
import profile from "../../../public/profileImage.png";

const DUMMYDATA = {
	avatar: profile,
	fullName: 'Ahmed Khirat',
	lvl: 2250,
	GamePoint: 1800,
	Rank: 2180,
	Tier: 'Gold',
	me: false,
	friend: true,
}


const DUMMYDATAOVER = {
	me: false,
	friend: true,
}

const ProfileFriend = () => {

	return (
		<>
			<ProfileInfo {...DUMMYDATA} />
			<Achievements />
			<OverView {...DUMMYDATAOVER} />
			<MatchHistory />
		</>
	);
};

export default ProfileFriend;
