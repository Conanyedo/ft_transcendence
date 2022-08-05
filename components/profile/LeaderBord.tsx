import classes from "../../styles/overView.module.css";

import TierGold from "../../public/LeaderBoard/Tier_Gold.svg";
import Rank_1 from "../../public/LeaderBoard/FirstPlace.svg";
import Rank_2 from "../../public/LeaderBoard/Second.svg";
import Rank_3 from "../../public/LeaderBoard/thirdPlace.svg";
import { Progress } from "react-sweet-progress";
import Image from "next/image";
import {isMobile} from 'react-device-detect';
import profile from "../../public/profileImage.png";

interface matchDataType {
	badge: number;
	fullName: string;
	games: number;
	WinRatio: string;
	lvlP: number;
}

const ElmRank: React.FC<matchDataType> = (props) => {
	const avatar = (props.badge === 1) ? Rank_1 : (props.badge === 2) ? Rank_2 : (props.badge === 3) ? Rank_3 : null;
	return (
		<div className={classes.tableElments}>
			<div className={classes.Rank}>
				<div className={classes.SvgSize}>
					{props.badge > 3 && props.badge || avatar && <Image src={avatar} />}
				</div>
			</div>
			<div className={`${classes.User} ${classes.UserTR}`}>
				<div className={classes.profileUser}>
					<Image src={profile} />
				</div>
				{props.fullName}
			</div>
			<div className={classes.games}>{props.games}</div>
			<div className={classes.WinRatio}>
				<div className={classes.WinRatioCalc}>{props.WinRatio}</div>
				<div className={classes.pourcentagectn}>
					<div
						className={classes.pourcentage}
						style={{
							width: `${props.lvlP}%`,
						}}
					></div>
				</div>
			</div>
			<div className={classes.Tier}>
				<div className={classes.SvgSize}>
					<Image src={TierGold} />
				</div>
			</div>
		</div>
	);
};

const LeaderBoard = () => {
	const lvlP = 72;
	return (
		<div className={classes.leaderBoard}>
			<div className={classes.table}>
				<div className={classes.LeaderBordTitle}>LeaderBoard</div>
				<div className={classes.leaderBoardctn}>
					<div className={`${classes.tableTitles} ${isMobile ? classes.tableTitlesInMobile : ' '}`}>
						<div
							className={` ${classes.Rank} ${classes.tableTitle} `}
						>
							Rank
						</div>
						<div
							className={`${classes.User} ${classes.tableTitle}  `}
						>
							Users
						</div>
						<div
							className={`${classes.games} ${classes.tableTitle}  `}
						>
							Games
						</div>
						<div
							className={`${classes.WinRatio} ${classes.tableTitle}  `}
						>
							Win Ratio
						</div>
						<div
							className={`${classes.Tier} ${classes.tableTitle}  `}
						>
							Tier
						</div>
					</div>
					<div className={classes.leaderBoardTable}>
						<ElmRank fullName="Choaib Abouelwafa" games={1200} WinRatio='72 % - 864W / 336L' lvlP={lvlP} badge={1} />
						<ElmRank fullName="Anas Elmqas" games={958} WinRatio='70 % - 864W / 336L' lvlP={70} badge={2} />
						<ElmRank fullName="Imane kachmiri" games={650} WinRatio='65 % - 864W / 336L' lvlP={65} badge={3} />
						<ElmRank fullName="Fati Fleur" games={481} WinRatio='60 % - 864W / 336L' lvlP={60} badge={4} />
						<ElmRank fullName="Asmae Lmkhantar" games={250} WinRatio='59 % - 864W / 336L' lvlP={59} badge={5} />
						<ElmRank fullName="Yassine Karma     " games={69} WinRatio='50 % - 864W / 336L' lvlP={50} badge={6} />
						<ElmRank fullName="Imane kachmiri" games={15} WinRatio='45 % - 864W / 336L' lvlP={45} badge={7} />
						<ElmRank fullName="Choaib Abouelwafa" games={0} WinRatio='0 % - 864W / 336L' lvlP={0} badge={8} />
						
					</div>
				</div>
			</div>
			<div className={classes.stat}>
				<div className={classes.LeaderBordTitle}>Stats</div>
				<div className={classes.statsctn}>
					<div className={classes.statDig}>
						<div className={classes.WinRateTitle}>Win Rate</div>
						<div className={classes.imageCTN}>
							<Progress
								type="circle"
								status="active"
								theme={{
									active: {
										trailColor: "#555D67",
										color: "#31BAAE",
									},
								}}
								symbolClassName={classes.textprogress}
								strokeWidth={10}
								width={128}
								percent={30}
								className={classes.progress}
							/>
						</div>
					</div>
					<div className={classes.statbtns}>
						<div className={classes.cntBTNstat}>1200 games</div>
						<div className={classes.cntBTNstat}>864 Wins</div>
						<div className={classes.cntBTNstat}>336 Losses</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LeaderBoard;
