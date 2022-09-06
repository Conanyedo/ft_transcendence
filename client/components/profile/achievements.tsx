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

const Achievements: React.FC<{ id: string }> = (props) => {
	const [achievementsids, setAchievementsids] = useState<number[]>([0]);
	const router = useRouter();
	useEffect(() => {
		fetchAchievements(setAchievementsids, router, props.id);
		return () => {
			setAchievementsids([0]);
		};
	}, [props.id]);
	return (
		<>
			<div className={classes.achievements}>
				<div className={classes.title}>Achievements</div>
				<div className={classes.ctnScroll}>
					{(!achievementsids.includes(0) &&
						achievementsids.map(
							(idx) =>
								!achievementsids.includes(0) && (
									<Achievement
										{...AllAchievement[idx - 1]}
										key={AllAchievement[idx - 1].id}
									/>
								)
						)) || (
						<div className={classes.noAchievements}>
							<span>No Achievements</span>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Achievements;
