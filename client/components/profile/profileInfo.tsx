import classes from "../../styles/Profile.module.css";
import Image from "next/image";
import pen from "../../public/EditPen.svg";
import React, { useEffect, useState } from "react";
import { EmtyUser, rankObj, UserTypeNew } from "../../Types/dataTypes";
import { useRouter } from "next/router";
import { fetchDATA } from "../../customHooks/useFetchData";
import { getImageBySize, getRankUser } from "../../customHooks/Functions";
import { Toggle } from "@store/UI-Slice";
import { useDispatch } from "react-redux";

const ProfileInfo: React.FC = () => {
	const [user, setUser] = useState<UserTypeNew>(EmtyUser);
	const router = useRouter();
	const dispatch = useDispatch();
	useEffect(() => {
		fetchDATA(setUser, router, 'user/info');
		return () => {
			setUser(EmtyUser);
		}
	}, []);
	const lvl = Math.floor((user?.stats.XP === 0) ? 0 : user?.stats.XP / 1000);
	const lvlP = (user?.stats.XP % 1000) / 10;
	const toggleHandler = () => dispatch(Toggle());
	const tier: rankObj = getRankUser(user?.stats.GP as number);
	if (user?.login !== '')
		localStorage.setItem("owner", user?.login);
	const pathImage = getImageBySize(user?.avatar, 220);
	return (
		<div className={`${classes.profile} `}>
			<div className={classes.editBtn}>
				<span>User Profile</span>
				<button onClick={toggleHandler}>
					<Image src={pen} />
					<span>Edit profile</span>
				</button>
			</div>
			<div className={classes.profileInfo}>
				<div className={classes.avatar}>
					<img
						alt={user?.fullname}
						src={pathImage}
					/>
				</div>
				<div className={classes.profileSection}>
					<div className={classes.name}>{user?.fullname}</div>
					<div className={classes.lvl}>Level: {user?.stats.XP} XP</div>
					<div className={classes.gp}>
						Game Poinrs: {user?.stats.GP} GP
					</div>
					<div className={classes.rank}>Rank: {user?.stats.rank}</div>
					<div className={classes.tier}>
						Tier: <span className={classes.gold} style={{
							color:`${tier.color}`
						}}>{tier.rank}</span>
					</div>
				</div>
				<div className={classes.tierIcon}>
					<Image
						style={{ backgroundColor: "transparent" }}
						src={tier.tier}
					/>
				</div>
			</div>
			<div className={classes.lvlContainer}>
				<div
					className={classes.lvldata}
				>{`Level ${lvl} - ${lvlP} %`}</div>
				<div
					className={classes.lvlpercent}
					style={{ width: `${lvlP}%` }}
				></div>
			</div>
		</div>
	);
};

export default ProfileInfo;
