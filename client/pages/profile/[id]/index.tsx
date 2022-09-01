import { useRouter } from "next/router";
import Achievements from "../../../components/profile/achievements";
import ProfileFriendInfo from "../../../components/profile/friendProfile/profileFriendInfo";
import OverViewFriend from "../../../components/profile/friendProfile/overViewFriend";
import MatchHistory from "../../../components/profile/MatchHistory";
import classes from "../../../styles/Profile.module.css";
import { useEffect, useState } from "react";
import Skeleton from "../../../components/skeleton";

const ProfileFriend = () => {
	const [userId, setuserId] = useState<number>();
	const route = useRouter();
	const { id } = route.query;
	useEffect(() => {
		setuserId(Number(id));
	}, [id]);

	return (
		<Skeleton
			elm={
				<div className={classes.profileCtn}>
					{userId && (
						<>
							<ProfileFriendInfo id={userId} />
							<Achievements id={userId} />
							<OverViewFriend id={userId} />
							<MatchHistory id={userId} />
						</>
					)}
				</div>
			}
		/>
	);
};

export default ProfileFriend;
