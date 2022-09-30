import { useRouter } from "next/router";
import Achievements from "../../../components/profile/achievements";
import ProfileFriendInfo from "../../../components/profile/friendProfile/profileFriendInfo";
import OverViewFriend from "../../../components/profile/friendProfile/overViewFriend";
import classes from "../../../styles/Profile.module.css";
import { useEffect, useState } from "react";
import LoadingElm from "../../../components/loading/Loading_elm";
import MatchHistoryFriend from "../../../components/profile/friendProfile/matchHistoryFriend";
import { userExists } from "@hooks/useFetchData";
import { useDispatch } from "react-redux";
import { ShowErrorMsg } from "@store/UI-Slice";

const ProfileFriend = () => {
	const [userId, setuserId] = useState<string>("");
	const route = useRouter();
	const dispatch = useDispatch();
	const { id } = route.query;
	const login = id as string;
	const owner = localStorage.getItem("owner");
	
	useEffect(() => {
		if (login)
			userExists(setuserId, login, route, dispatch);
	}, [login]);
	if (login === owner as string) {
		route.replace('/profile');
		return <LoadingElm />
	}
	return (
		<>
			{userId && 
					<div className={classes.profileCtn}>
						{userId && (
							<>
								<ProfileFriendInfo id={userId} />
								<Achievements id={userId} />
								<OverViewFriend id={userId} />
								<MatchHistoryFriend login={userId} />
							</>
						)}
					</div>
				}
		</>
	);
};

export default ProfileFriend;
