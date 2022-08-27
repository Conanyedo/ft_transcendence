import ProfileInfo from "../../components/profile/profileInfo";
import Achievements from "../../components/profile/achievements";
import OverView from "../../components/profile/overView";
import MatchHistory from "../../components/profile/MatchHistory";

import classes from "../../styles/Profile.module.css";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useEffect } from "react";
import axios from "axios";

const Profile = () => {
	const route = useRouter();
	const token = getCookie("jwt");

	const requestOptions = {
		Authorization: `Bearer ${token}`,
	};
	const fetchData = async () => {
		await axios.get(`http://localhost:5000/auth/isAuthorized`, {
			headers: requestOptions,
			withCredentials: true,
			method: 'GET'
		})
			.then((res) => {
				console.log('hello ',res.data.login);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	useEffect(() => {
		fetchData();
	}, []);
	const id = 1001;
	return (
		<div className={classes.profileCtn}>
			<ProfileInfo />
			<Achievements id={id} />
			<OverView id={id} />
			<MatchHistory id={id} />
			<div className={classes.buttom}></div>
		</div>
	);
};
export default Profile;
