import classes from "../../styles/achievements.module.css";
import Gold from "../../public/GoldKing.svg";
import Image from "next/Image";

const Achievements = () => {
	return (
		<div className={classes.achievements}>
			<div className={classes.title}>Achievements</div>
			<div className={classes.achievementctn}>
				<Image src={Gold} className={classes.badge} />
				<div className={classes.achievement}>
					<p className={classes.achievementTitle}>Gold king</p>
					<p className={classes.disc}>Reaching the gold tier</p>
				</div>
			</div>
			<div className={classes.achievementctn}>
				<Image src={Gold}  className={classes.badge} />
				<div className={classes.achievement}>
					<p className={classes.achievementTitle}>Gold king</p>
					<p className={classes.disc}>Reaching the gold tier</p>
				</div>
			</div>
			<div className={classes.achievementctn}>
				<Image src={Gold}  className={classes.badge} />
				<div className={classes.achievement}>
					<p className={classes.achievementTitle}>Gold king</p>
					<p className={classes.disc}>Reaching the gold tier</p>
				</div>
			</div>
			<div className={classes.achievementctn}>
				<Image src={Gold}  className={classes.badge} />
				<div className={classes.achievement}>
					<p className={classes.achievementTitle}>Gold king</p>
					<p className={classes.disc}>Reaching the gold tier</p>
				</div>
			</div>
		</div>
	);
};

export default Achievements;
