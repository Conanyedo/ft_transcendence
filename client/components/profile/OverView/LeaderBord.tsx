import classes from "../../../styles/overView.module.css"
import Rank_1 from "../../../public/LeaderBoard/FirstPlace.svg"
import Rank_2 from "../../../public/LeaderBoard/Second.svg"
import Rank_3 from "../../../public/LeaderBoard/thirdPlace.svg"
import Image from "next/image"
import { isMobile } from "react-device-detect"
import { useEffect, useState } from "react"
import { EmtyUser, matchDataType, rankObj, UserTypeNew } from "../../../Types/dataTypes"
import Chart from "../../chart/chartProgress"
import { motion } from "framer-motion"
import { useRouter } from "next/router"
import { fetchDATA } from "../../../customHooks/useFetchData"
import { getImageBySize, getRankUser } from "../../../customHooks/Functions"

const ElmRank: React.FC<matchDataType> = (props) => {
	const avatar = props.badge === 1 ? Rank_1 : props.badge === 2 ? Rank_2 : props.badge === 3 ? Rank_3 : null
	const route = useRouter()
	const owner = localStorage.getItem("owner");
	const Clickhandler = () => {
		if (props.relation === "blocked" || props.login === owner)
			return;
		route.push("/profile/" + props.login)
	}
	const tier: rankObj = getRankUser(props.GP)
	let winRatio = Math.floor((props.Win / props.games) * 100)
	winRatio = winRatio ? winRatio : 0
	const pathImage = getImageBySize(props.avatar, 70)
	return (
		<div className={classes.tableElments}>
			<div className={classes.Rank}>
				<div className={classes.SvgSize}>
					{(props.badge > 3 && props.badge) || (avatar && <Image src={avatar} />)}
				</div>
			</div>
			<div className={`${classes.User} ${classes.UserTR}`} onClick={Clickhandler}>
				<div className={classes.profileUser}>
					<img src={pathImage} />
				</div>
				{props.fullName}
			</div>
			<div className={`${classes.games} ${classes.gamesTotal}`}>{props.games}</div>
			<div className={classes.WinRatio}>
				<div className={classes.WinRatioCalc}>{`${winRatio} % - ${props.Win}W / ${
					props.games - props.Win
				}L`}</div>
				<div className={classes.pourcentagectn}>
					<div
						className={classes.pourcentage}
						style={{
							width: `${winRatio}%`,
						}}></div>
				</div>
			</div>
			<div className={classes.Tier}>
				<div className={classes.SvgSize}>
					<Image src={tier.tier} />
				</div>
			</div>
		</div>
	)
}

const Stats: React.FC = () => {
	const [user, setUser] = useState<UserTypeNew>(EmtyUser)
	const [isUp, SetIsUp] = useState(false)
	const router = useRouter()
	const login = router.query?.id
	useEffect(() => {
		fetchDATA(setUser, router, `user/stats${login ? "/" + login : ""}`)
		SetIsUp(true)
		return () => {
			setUser(EmtyUser);
		}
	}, [login])
	const amount = user?.gamesWon === 0 ? 0 : Math.floor((user?.gamesWon / user?.numGames) * 100)
	return (
		<>
			{isUp && (
				<div className={classes.stat}>
					<div className={classes.LeaderBordTitle}>Stats</div>
					<div className={classes.statsctn}>
						<div className={classes.statDig}>
							<div className={classes.WinRateTitle}>Win Rate</div>
							<div className={classes.imageCTN}>{user && <Chart amount={amount} />}</div>
						</div>
						<div className={classes.statbtns}>
							{user && (
								<>
									<div className={classes.cntBTNstat}>{user?.numGames} games</div>
									<div className={classes.cntBTNstat}>{user?.gamesWon} Wins</div>
									<div className={classes.cntBTNstat}>{user?.numGames - user?.gamesWon} Losses</div>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	)
}

const LeaderBoard: React.FC = () => {
	const [listUsers, setListUsers] = useState<UserTypeNew[]>([])
	const [isUp, SetIsUp] = useState(false)
	const router = useRouter()
	useEffect(() => {
		fetchDATA(setListUsers, router, "user/leaderborad")
		SetIsUp(true)
		return () => {
			setListUsers([])
		}
	}, [])

	return (
		<>
			{isUp && (
				<div className={classes.leaderBoard}>
					<div className={classes.table}>
						<div className={classes.LeaderBordTitle}>LeaderBoard</div>
						<div className={classes.leaderBoardctn}>
							<div className={`${isMobile ? classes.tableTitlesInMobile : classes.tableTitles}`}>
								<div className={`${classes.Rank} ${classes.tableTitle}`}>Rank</div>
								<div className={`${classes.User} ${classes.tableTitle}`}>Users</div>
								<div className={`${classes.games} ${classes.tableTitle}`}>Games</div>
								<div className={`${classes.WinRatio} ${classes.tableTitle}`}>Win Ratio</div>
								<div className={`${classes.Tier} ${classes.tableTitle}`}>Tier</div>
							</div>
							<motion.div
								initial={{ y: 10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								exit={{ y: -10, opacity: 0 }}
								transition={{ duration: 0.5 }}
								className={classes.leaderBoardTable}>
								{listUsers &&
									listUsers.map((user, idx) => (
										<ElmRank
											key={user?.login}
											fullName={user?.fullname}
											games={user?.numGames}
											Win={user?.gamesWon}
											badge={idx + 1}
											avatar={user?.avatar}
											login={user?.login}
											GP={user?.GP}
											relation={user?.relation}
										/>
									))}
							</motion.div>
						</div>
					</div>
					<Stats />
				</div>
			)}
		</>
	)
}

export default LeaderBoard
