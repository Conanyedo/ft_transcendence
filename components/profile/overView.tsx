import classes from "../../styles/overView.module.css";
import Image from "next/image";
import profile from "../../public/profileImage.png";

import { motion } from "framer-motion";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";

import TierGold from "../../public/LeaderBoard/Tier_Gold.svg";
import Rank_1 from "../../public/LeaderBoard/FirstPlace.svg";
import Rank_2 from "../../public/LeaderBoard/Second.svg";
import Rank_3 from "../../public/LeaderBoard/thirdPlace.svg";
import { useState } from "react";

import Search from "../../public/Icon.svg";
import FriendList from "./FriendList";
// import Message from ''

const OverView = () => {
	const [overViewShow, setOverViewShow] = useState(false);

	const showOverView = () => {
		setOverViewShow(true);
	};
	const hideOverView = () => setOverViewShow(false);
	const lvlP = 72;
	let underLineOverView = overViewShow ? classes.overViewbtn : " ";
	let underLinefriends = !overViewShow ? classes.FriendsBtn : " ";
	let classesIndic = !overViewShow && classes.IndicFriend || classes.Indic;
	return (
		<div className={classes.overviewCtn}>
			<div>
				<div className={classes.navView}>
					<div
						className={`${classes.TitleOverView}  ${underLineOverView}`}
						onClick={showOverView}
					>
						Overview
					</div>
					<div
						className={`${classes.TitleOverView} ${underLinefriends} `}
						onClick={hideOverView}
					>
						Friends
					</div>
				</div>
				<div className={classes.ctnIndic}>
					<motion.div
						exit={{ opacity: 0 }}
						animate="animate"
						className={classesIndic}
					></motion.div>
				</div>
			</div>
			<div className={classes.overview}>
				{overViewShow && (
					<div className={classes.leaderBoard}>
						<div className={classes.table}>
							<div className={classes.LeaderBordTitle}>
								LeaderBoard
							</div>
							<div className={classes.leaderBoardctn}>
								<div className={classes.leaderBoardTable}>
									<div className={classes.tableTitles}>
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
									<div className={classes.tableElments}>
										<div className={classes.Rank}>
											<div className={classes.SvgSize}>
												<Image src={Rank_1} />
											</div>
										</div>
										<div
											className={`${classes.User} ${classes.UserTR}`}
										>
											<div
												className={classes.profileUser}
											>
												<Image src={profile} />
											</div>
											Choaib ABouelwafa
										</div>
										<div className={classes.games}>
											1200
										</div>
										<div className={classes.WinRatio}>
											<div
												className={classes.WinRatioCalc}
											>
												72 % - 864W / 336L
											</div>
											<div
												className={
													classes.pourcentagectn
												}
											>
												<div
													className={
														classes.pourcentage
													}
													style={{
														width: `${lvlP}%`,
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
									<div className={classes.tableElments}>
										<div className={classes.Rank}>
											<div className={classes.SvgSize}>
												<Image src={Rank_2} />
											</div>
										</div>
										<div
											className={`${classes.User} ${classes.UserTR}`}
										>
											<div
												className={classes.profileUser}
											>
												<Image src={profile} />
											</div>
											Younnes Bouddou
										</div>
										<div className={classes.games}>
											1200
										</div>
										<div className={classes.WinRatio}>
											<div
												className={classes.WinRatioCalc}
											>
												72 % - 864W / 336L
											</div>
											<div
												className={
													classes.pourcentagectn
												}
											>
												<div
													className={
														classes.pourcentage
													}
													style={{
														width: `${lvlP}%`,
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
									<div className={classes.tableElments}>
										<div className={classes.Rank}>
											<div className={classes.SvgSize}>
												<Image src={Rank_3} />
											</div>
										</div>
										<div
											className={`${classes.User} ${classes.UserTR}`}
										>
											<div
												className={classes.profileUser}
											>
												<Image src={profile} />
											</div>
											Abdo belhachmi
										</div>
										<div className={classes.games}>800</div>
										<div className={classes.WinRatio}>
											<div
												className={classes.WinRatioCalc}
											>
												72 % - 864W / 336L
											</div>
											<div
												className={
													classes.pourcentagectn
												}
											>
												<div
													className={
														classes.pourcentage
													}
													style={{
														width: `${lvlP}%`,
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
									<div className={classes.tableElments}>
										<div className={classes.Rank}>
											<div className={classes.SvgSize}>
												4
											</div>
										</div>
										<div
											className={`${classes.User} ${classes.UserTR}`}
										>
											<div
												className={classes.profileUser}
											>
												<Image src={profile} />
											</div>
											Abdo belhachmi
										</div>
										<div className={classes.games}>800</div>
										<div className={classes.WinRatio}>
											<div
												className={classes.WinRatioCalc}
											>
												72 % - 864W / 336L
											</div>
											<div
												className={
													classes.pourcentagectn
												}
											>
												<div
													className={
														classes.pourcentage
													}
													style={{
														width: `${lvlP}%`,
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
									<div className={classes.tableElments}>
										<div className={classes.Rank}>
											<div className={classes.SvgSize}>
												5
											</div>
										</div>
										<div
											className={`${classes.User} ${classes.UserTR}`}
										>
											<div
												className={classes.profileUser}
											>
												<Image src={profile} />
											</div>
											Abdo belhachmi
										</div>
										<div className={classes.games}>800</div>
										<div className={classes.WinRatio}>
											<div
												className={classes.WinRatioCalc}
											>
												72 % - 864W / 336L
											</div>
											<div
												className={
													classes.pourcentagectn
												}
											>
												<div
													className={
														classes.pourcentage
													}
													style={{
														width: `${lvlP}%`,
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
									<div className={classes.tableElments}>
										<div className={classes.Rank}>
											<div className={classes.SvgSize}>
												6
											</div>
										</div>
										<div
											className={`${classes.User} ${classes.UserTR}`}
										>
											<div
												className={classes.profileUser}
											>
												<Image src={profile} />
											</div>
											Abdo belhachmi
										</div>
										<div className={classes.games}>800</div>
										<div className={classes.WinRatio}>
											<div
												className={classes.WinRatioCalc}
											>
												72 % - 864W / 336L
											</div>
											<div
												className={
													classes.pourcentagectn
												}
											>
												<div
													className={
														classes.pourcentage
													}
													style={{
														width: `${lvlP}%`,
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
								</div>
							</div>
						</div>
						<div className={classes.stat}>
							<div className={classes.LeaderBordTitle}>Stats</div>
							<div className={classes.statsctn}>
								<div className={classes.WinRateTitle}>
									Win Rate
								</div>
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
									/>
								</div>
								<div className={classes.cntBTNstat}>
									1200 games
								</div>
								<div className={classes.cntBTNstat}>
									864 Wins
								</div>
								<div className={classes.cntBTNstat}>
									336 Losses
								</div>
							</div>
						</div>
					</div>
				)}
				{!overViewShow && <FriendList />}
			</div>
		</div>
	);
};

export default OverView;
