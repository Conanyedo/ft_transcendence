import classes from "../../styles/Profile.module.css";
import profile from "../../public/profileImage.png";
import Image from "next/image";
import pen from "../../public/editPen.svg";
import Gold from "../../public/GoldTier.svg";
import ProfileInfo from "../../components/profile/profileInfo";
import Achievements from "../../components/profile/achievements";

const Profile = () => {
	// const XP = 5690;
	// const lvl = Math.floor(XP / 1000);
	// const lvlP = XP % 1000 / 10;
	return (
		<>
			<ProfileInfo />
			<Achievements />
			<div className={classes.overview}></div>
			<div className={classes.history}></div>
		</>
	);
};

export default Profile;
