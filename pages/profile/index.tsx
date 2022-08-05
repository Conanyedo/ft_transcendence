import ProfileInfo from "../../components/profile/profileInfo";
import Achievements from "../../components/profile/achievements";
import OverView from "../../components/profile/overView";
import MatchHistory from "../../components/profile/MatchHistory";
import profile from "../../public/profileImage.png";


const DUMMYDATA = {
	avatar: profile,
	fullName: 'Choaib Abouelwafa',
	lvl: 2250,
	GamePoint: 1800,
	Rank: 2180,
	Tier: 'Gold',
	me: true,
	friend: false,
}


const DUMMYDATAOVER = {
	me: true,
}



const Profile = () => {
	// alert('test');

	return (
		<>
			<ProfileInfo {...DUMMYDATA} />
			<Achievements />
			<OverView {...DUMMYDATAOVER} />
			<MatchHistory />
		</>
	);
};
export default Profile;
