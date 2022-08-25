import ProfileInfo from "../../components/profile/profileInfo";
import Achievements from "../../components/profile/achievements";
import OverView from "../../components/profile/overView";
import MatchHistory from "../../components/profile/MatchHistory";

import classes from "../../styles/Profile.module.css";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";

const Profile = () => {
	const route = useRouter();
	const token = getCookie('jwt');
	console.log(token);
	
	// const requestOptions = {
    //     method: 'Get',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ title: 'React POST Request Example' })
    // };
	// const fetchData = async () => {
	// 	await fetch(`http://10.13.10.6:3000/auth/isAuthorized`, {
	// 		}
	// 	)
	// 		.then((res) => {
	// 			console.log(res);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };
	// if (route.query.code) route.replace("/profile");
	// const id = Number(window.localStorage.getItem("owner"));
	const id = 1001;
	// if (!id) route.replace("/");
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
