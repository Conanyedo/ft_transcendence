import classes from "../../styles/achievements.module.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AllAchievement } from "../../config/Achievement";
import { achievementType } from "../../Types/dataTypes";
import Image from "next/image";
import { fetchAchievements, fetchDATA } from "../../customHooks/useFetchData";

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
	useEffect(()  => {
		fetchAchievements(setAchievementsids, router);
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
