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

const ProfileFriend = () => {
	const [isUp, setisUp] = useState(false);
	const [userId, setuserId] = useState<string>("");
	const route = useRouter();
	const dispatch = useDispatch();
	const { id } = route.query;
	const login = id as string;
	const owner = localStorage.getItem("owner");
	
	if (login === owner as string) {
		route.replace('/profile');
		return <LoadingElm />
	}
	
	useEffect(() => {
		setisUp(true);
	}, [])
	useEffect(() => {
		if (login && (/^(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/g).test(login))
			userExists(setuserId, login, route, dispatch);
		return () => {
			setuserId('');
		}
	}, [login]);
	return (
		<>
			{userId && isUp &&
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
