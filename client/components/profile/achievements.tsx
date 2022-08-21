import classes from "../../styles/achievements.module.css";
import Gold from "../../public/GoldKing.svg";
import Image from "next/image";
import React from "react";

interface TypeAchievement {
	logo: any;
	title: string;
	disc: string;
}

const Achievement: React.FC<TypeAchievement> = (props) => {
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

const Achievements = () => {
	return (
		<div className={classes.achievements}>
			<div className={classes.title}>Achievements</div>
			<div className={classes.ctnScroll}>
				<Achievement
					logo={Gold}
					title="Gold king"
					disc="Reaching the gold tier"
				/>
				<Achievement
					logo={Gold}
					title="Gold king"
					disc="Reaching the gold tier"
				/>
				<Achievement
					logo={Gold}
					title="Gold king"
					disc="Reaching the gold tier"
				/>
				<Achievement
					logo={Gold}
					title="Gold king"
					disc="Reaching the gold tier"
				/>
				<Achievement
					logo={Gold}
					title="Gold king"
					disc="Reaching the gold tier"
				/>
				<Achievement
					logo={Gold}
					title="Gold king"
					disc="Reaching the gold tier"
				/>
				<Achievement
					logo={Gold}
					title="Gold king"
					disc="Reaching the gold tier"
				/>
			</div>
		</div>
	);
};

export default Achievements;
