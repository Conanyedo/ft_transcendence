import { useRouter } from "next/router";
import Achievements from "../../../components/profile/achievements";
import ProfileFriendInfo from "../../../components/profile/friendProfile/profileFriendInfo";
import OverViewFriend from "../../../components/profile/friendProfile/overViewFriend";
import MatchHistory from "../../../components/profile/MatchHistory";
import classes from "../../../styles/Profile.module.css";
import { useEffect, useState } from "react";
import Skeleton from "../../../components/skeleton";
import ContentWrapper from "../../../components/wrapper/appWrapper";

const ProfileFriend = () => {
	const [userId, setuserId] = useState<string>("");
	const route = useRouter();
	const { id } = route.query;
	const login = id as string;
	useEffect(() => {
		setuserId(login);
	}, [login]);

	return (
		<>
			{userId && <ContentWrapper
				children={
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
			/>}
		</>
	);
};

export default ProfileFriend;
