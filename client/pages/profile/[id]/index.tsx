import { useRouter } from "next/router";
import Achievements from "../../../components/profile/achievements";
import ProfileFriendInfo from "../../../components/profile/friend/profileFriendInfo";
import OverViewFriend from "../../../components/profile/friend/overViewFriend";
import MatchHistoryFriend from "../../../components/profile/friend/matchHistoryFriend";

const ProfileFriend = () => {
	const route = useRouter();
	const { id } = route.query;

	return (
		<>
			<ProfileFriendInfo id={Number(id)} />
			<Achievements />
			<OverViewFriend />
			<MatchHistoryFriend />
		</>
	);
};

export default ProfileFriend;
