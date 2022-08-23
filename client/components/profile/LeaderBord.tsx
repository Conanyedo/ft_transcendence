import classes from "../../styles/overView.module.css";
import { initialState as emtyUser } from "../store/userSlice";

import TierGold from "../../public/LeaderBoard/Tier_Gold.svg";
import Rank_1 from "../../public/LeaderBoard/FirstPlace.svg";
import Rank_2 from "../../public/LeaderBoard/Second.svg";
import Rank_3 from "../../public/LeaderBoard/thirdPlace.svg";
import Image from "next/image";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserType } from "../../Types/dataTypes";
import Chart from "../chart/chartProgress";

interface matchDataType {
	badge: number;
	fullName: string;
	games: number;
	Win: number;
	lvlP: number;
	avatar: string;
}

const ElmRank: React.FC<matchDataType> = (props) => {
	const avatar =
		props.badge === 1
			? Rank_1
			: props.badge === 2
			? Rank_2
			: props.badge === 3
			? Rank_3
			: null;
	return (
		<div className={classes.tableElments}>
			<div className={classes.Rank}>
				<div className={classes.SvgSize}>
					{(props.badge > 3 && props.badge) ||
						(avatar && <Image src={avatar} />)}
				</div>
			</div>
			<div className={`${classes.User} ${classes.UserTR}`}>
				<div className={classes.profileUser}>
					{/* <Image src={profile} /> */}
					<img src={props.avatar} />
				</div>
				{props.fullName}
			</div>
			<div className={`${classes.games} ${classes.gamesTotal}`}>
				{props.games}
			</div>
			<div className={classes.WinRatio}>
				<div className={classes.WinRatioCalc}>{`${Math.floor(
					(props.Win / props.games) * 100
				)} % - ${props.Win}W / ${props.games - props.Win}L`}</div>{" "}
				{/*  70 % - 864W / 336L  */}
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

const Stats = () => {
	const [user, setUser] = useState<UserType>(emtyUser);
	const rout = useRouter();
	useEffect(() => {
		const fetchData = async () => {
			const data = await axios
				.get(
					`https://test-76ddc-default-rtdb.firebaseio.com/${
						rout.query.id || "owner"
					}.json`
				)
				.then((res) => {
					setUser(res.data);
				});
		};
		if (user.fullName === "") fetchData();
	}, []);
	return (
		<div className={classes.stat}>
			<div className={classes.LeaderBordTitle}>Stats</div>
			<div className={classes.statsctn}>
				<div className={classes.statDig}>
					<div className={classes.WinRateTitle}>Win Rate</div>
					<div className={classes.imageCTN}>
						<Chart
							amount={Math.floor((user.wins / user.games) * 100)}
						/>
					</div>
				</div>
				<div className={classes.statbtns}>
					<div className={classes.cntBTNstat}>{user.games} games</div>
					<div className={classes.cntBTNstat}>{user.wins} Wins</div>
					<div className={classes.cntBTNstat}>
						{user.games - user.wins} Losses
					</div>
				</div>
			</div>
		</div>
	);
};

const LeaderBoard: React.FC<{ owner: UserType }> = (props) => {
	const [listUsers, setListUsers] = useState<UserType[]>();
	let users: UserType[] = [];
	useEffect(() => {
		const fetchData = async () => {
			const data = await axios
				.get("https://test-76ddc-default-rtdb.firebaseio.com/all.json")
				.then((res) => {
					const entries = Object.entries(res.data);
					entries.map((user) => {
						users.push(user[1]);
					});
					setListUsers(users);
				});
		};
		if (!listUsers) fetchData();
	}, []);

	const lvlP = 72;
	return (
		<div className={classes.leaderBoard}>
			<div className={classes.table}>
				<div className={classes.LeaderBordTitle}>LeaderBoard</div>
				<div className={classes.leaderBoardctn}>
					<div
						className={`${
							isMobile
								? classes.tableTitlesInMobile
								: classes.tableTitles
						}`}
					>
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
						{listUsers &&
							listUsers.map((user) => (
								<ElmRank
									fullName={user.fullName}
									games={user.games}
									Win={user.wins}
									lvlP={(user.lvl % 1000) / 10}
									badge={user.RankPos}
									avatar={user.avatar}
								/>
							))}
						{listUsers &&
							listUsers.map((user) => (
								<ElmRank
									fullName={user.fullName}
									games={user.games}
									Win={user.wins}
									lvlP={(user.lvl % 1000) / 10}
									badge={user.RankPos}
									avatar={user.avatar}
								/>
							))}
					</div>
				</div>
			</div>
			<Stats />
		</div>
	);
};

export default LeaderBoard;
