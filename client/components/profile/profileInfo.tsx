import classes from "../../styles/Profile.module.css";
import Image from "next/image";
import pen from "../../public/editPen.svg";
import TierGold from "../../public/LeaderBoard/Tier_Gold.svg";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { Toggle } from "../store/UI-Slice";
import { initialState as emtyUser } from "../store/userSlice";
import axios from "axios";
import { UserType } from "../../Types/dataTypes";

const ProfileInfo: React.FC = () => {
	const [user, setUser] = useState<UserType>(emtyUser);
	const dispatch = useAppDispatch();
	useEffect(() => {
		const fetchData = async () => {
			const data = await axios
				.get(
					`https://test-76ddc-default-rtdb.firebaseio.com/owner.json`
				)
				.then((res) => {
					setUser(res.data);
				});
		};
		if (user.fullName === '') fetchData();
	}, []);
	const lvl = Math.floor(user.lvl / 1000);
	const lvlP = (user.lvl % 1000) / 10;
	const toggleHandler = () => dispatch(Toggle());
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
						alt={user.fullName}
						src={user.avatar}
					/>
				</div>
				<div className={classes.profileSection}>
					<div className={classes.name}>{user.fullName}</div>
					<div className={classes.lvl}>Level: {user.lvl} XP</div>
					<div className={classes.gp}>
						Game Poinrs: {user.GamePoint} GP
					</div>
					<div className={classes.rank}>Rank: {user.Rank}</div>
					<div className={classes.tier}>
						Tier: <span className={classes.gold}>{user.Tier}</span>
					</div>
				</div>
				<div className={classes.tierIcon}>
					<Image
						style={{ backgroundColor: "transparent" }}
						src={TierGold}
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
