import classes from "../../styles/achievements.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl, eraseCookie } from "../../config/baseURL";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { AllAchievement } from "../../config/Achievement";
import { achievementType } from "../../Types/dataTypes";
import Image from "next/image";

const Achievement: React.FC<achievementType> = (props) => {
	return (
		<div className={classes.achievementctn}>
			<div className={classes.badge}>
				<Image src={props.logo} />
			</div>
			<div className={classes.achievement}>
				<p className={classes.achievementTitle}>{props.title}</p>
				<p className={classes.disc}>{props.disc}</p>
			</div>
		</div>
	);
};

const Achievements: React.FC<{ id: Number }> = (props) => {
	let userAchievments: achievementType[] = [];
	const [achievementsids, setAchievementsids] = useState<number[]>([0]);
	const [achievementsItems, setAchievementsItems] = useState<
		achievementType[]
	>([]);
	const router = useRouter();
	const token = getCookie("jwt");
	const fetchData = async () => {
		await axios
			.get(`${baseUrl}user/achievements`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				withCredentials: true,
			})
			.then((res) => {
				setAchievementsids(res.data.achievements);
			})
			.catch((err) => {
				eraseCookie("jwt");
				router.replace("/");
			});
	};
	useEffect(()  => {
		fetchData();
	}, []);
	if (!achievementsids.includes(0)) {
		achievementsids.map((idx) => {
			userAchievments.push(AllAchievement[idx - 1]);
		});
		if (!achievementsItems.length)
			setAchievementsItems(userAchievments);
	}
	return (
		<div className={classes.achievements}>
			<div className={classes.title}>Achievements</div>
			<div className={classes.ctnScroll}>
				{achievementsItems && !achievementsids.includes(0) &&
					achievementsItems.map((item) => <Achievement {...item} key={item.id} /> ) || 
					<div className={classes.noAchievements} >No Achievement Yet</div>
					}
			</div>
		</div>
	);
};

export default Achievements;
