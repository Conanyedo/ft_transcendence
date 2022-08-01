import classes from "../../styles/Profile.module.css";
import profile from "../../public/profileImage.png";
import Image from "next/image";
import pen from "../../public/editPen.svg";
import Gold from "../../public/GoldTier.svg";
import TierGold from "../../public/LeaderBoard/Tier_Gold.svg";

const ProfileInfo = () => {
	const XP = 5690;
	const lvl = Math.floor(XP / 1000);
	// const lvlP = (XP % 1000) / 10;
	const lvlP = 50;
	return (
		<div className={classes.profile}>
			<div className={classes.editBtn}>
				<button>
					<Image
						src={pen}
						style={{ backgroundColor: "transparent" }}
					/>
					<span>Edit profile</span>
				</button>
			</div>
			<div className={classes.profileInfo}>
				{/* <div className={classes.profileTier}> */}
				<div className={classes.avatar}>
					<Image src={profile} />
				</div>
				<div className={classes.profileSection}>
					<div className={classes.name}>Choaib Abouelwafa</div>
					<div className={classes.lvl}>Level: 5690 XP</div>
					<div className={classes.gp}>Game Poinrs: 4500 GP</div>
					<div className={classes.rank}>Rank: 1</div>
					<div className={classes.tier}>
						Tier: <span className={classes.gold}>Gold</span>
					</div>
				</div>
				{/* </div> */}
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
