import classes from "../../styles/overView.module.css";
import { initialState as emtyUser } from "../store/userSlice";

import TierGold from "../../public/LeaderBoard/Tier_Gold.svg";
import Rank_1 from "../../public/LeaderBoard/FirstPlace.svg";
import Rank_2 from "../../public/LeaderBoard/Second.svg";
import Rank_3 from "../../public/LeaderBoard/thirdPlace.svg";
import Image from "next/image";
import { isMobile } from "react-device-detect";
import axios from "axios";
import { useEffect, useState } from "react";
import { matchDataType, UserType } from "../../Types/dataTypes";
import Chart from "../chart/chartProgress";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const ElmRank: React.FC<matchDataType> = (props) => {
	const avatar =
		props.badge === 1
			? Rank_1
			: props.badge === 2
			? Rank_2
			: props.badge === 3
			? Rank_3
			: null;
	const route = useRouter();
	const Clickhandler = () => route.push("/profile/" + props.id);
	return (
		<div className={classes.tableElments}>
			<div className={classes.Rank}>
				<div className={classes.SvgSize}>
					{(props.badge > 3 && props.badge) ||
						(avatar && <Image src={avatar} />)}
				</div>
			</div>
			<div
				className={`${classes.User} ${classes.UserTR}`}
				onClick={Clickhandler}
			>
				<div className={classes.profileUser}>
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
				)} % - ${props.Win}W / ${props.games - props.Win}L`}</div>
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

const Stats: React.FC<{ id: number }> = (props) => {
	const [user, setUser] = useState<UserType>(emtyUser);
	const fetchData = async () => {
		const data = await axios
			.get(
				`https://test-76ddc-default-rtdb.firebaseio.com/${props.id}.json`
			)
			.then((res) => {
				setUser(res.data);
			});
	};
	useEffect(() => {
		if (user?.fullName === "") fetchData();
		else return;
	}, []);
	return (
		<div className={classes.stat}>
			<div className={classes.LeaderBordTitle}>Stats</div>
			<div className={classes.statsctn}>
				<div className={classes.statDig}>
					<div className={classes.WinRateTitle}>Win Rate</div>
					<div className={classes.imageCTN}>
						{user && (
							<Chart
								amount={Math.floor(
									(user.wins / user.games) * 100
								)}
							/>
						)}
					</div>
				</div>
				<div className={classes.statbtns}>
					{user && (
						<>
							<div className={classes.cntBTNstat}>
								{user.games} games
							</div>
							<div className={classes.cntBTNstat}>
								{user.wins} Wins
							</div>
							<div className={classes.cntBTNstat}>
								{user.games - user.wins} Losses
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

const LeaderBoard: React.FC<{ id: number }> = (props) => {
	const [listUsers, setListUsers] = useState<UserType[]>();
	let users: UserType[] = [];
	useEffect(() => {
		const fetchData = async () => {
			const data = await axios
				.get("https://test-76ddc-default-rtdb.firebaseio.com/all.json")
				.then((res) => {
					const entries = Object.entries(res.data);
					entries.map((user) => {
						users.push(user[1] as UserType);
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
							className={`${classes.Rank} ${classes.tableTitle}`}
						>
							Rank
						</div>
						<div
							className={`${classes.User} ${classes.tableTitle}`}
						>
							Users
						</div>
						<div
							className={`${classes.games} ${classes.tableTitle}`}
						>
							Games
						</div>
						<div
							className={`${classes.WinRatio} ${classes.tableTitle}`}
						>
							Win Ratio
						</div>
						<div
							className={`${classes.Tier} ${classes.tableTitle}`}
						>
							Tier
						</div>
					</div>
					<motion.div
						initial={{ y: 10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -10, opacity: 0 }}
						transition={{ duration: 0.5 }}
						className={classes.leaderBoardTable}
					>
						{listUsers &&
							listUsers.map((user) => (
								<ElmRank
									key={user.id}
									fullName={user.fullName}
									games={user.games}
									Win={user.wins}
									lvlP={(user.lvl % 1000) / 10}
									badge={user.RankPos}
									avatar={user.avatar}
									id={user.id}
								/>
							))}
						{listUsers &&
							listUsers.map((user) => (
								<ElmRank
									key={user.id}
									fullName={user.fullName}
									games={user.games}
									Win={user.wins}
									lvlP={(user.lvl % 1000) / 10}
									badge={user.RankPos}
									avatar={user.avatar}
									id={user.id}
								/>
							))}
					</motion.div>
				</div>
			</div>
			<Stats {...props} />
		</div>
	);
};

export default LeaderBoard;
