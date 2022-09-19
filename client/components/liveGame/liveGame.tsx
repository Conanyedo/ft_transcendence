import classes from "../../styles/liveGame.module.css";
import Play from "../../public/WatchLiveGame.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import socket_game from "../../config/socketGameConfig";
import {
	EmtyUser,
	headerDataType,
	headerGameType,
	UserTypeNew,
} from "../../Types/dataTypes";
import { useRouter } from "next/router";
import { fetchDATA } from "../../customHooks/useFetchData";
import { getImageBySize, getRankUser } from "../../customHooks/Functions";

export const LiveGame: React.FC<headerGameType> = (props) => {
	const router = useRouter();
	const [userInfo1, setUserInfo1] = useState<UserTypeNew>(EmtyUser);
	const [userInfo2, setUserInfo2] = useState<UserTypeNew>(EmtyUser);
	const [Data, setData] = useState<headerDataType>();

	useEffect(() => {
		socket_game.emit("watchGame", { ID: props.gameId });
		socket_game.on("ScoreStatus", (data) => {
			setData(data);
		});
		return () => {
			socket_game.off("ScoreStatus");
		};
	}, [props.gameId]);
	useEffect(() => {
		if (Data?.firstPlayer)
			fetchDATA(setUserInfo1, router, `user/info/${Data?.firstPlayer}`);
		if (Data?.secondPlayer)
			fetchDATA(setUserInfo2, router, `user/info/${Data?.secondPlayer}`);
	}, [Data?.firstPlayer]);
	const rank1 = getRankUser(userInfo1.stats.GP);
	const rank2 = getRankUser(userInfo2.stats.GP);
	const pathImage1 = getImageBySize(userInfo1?.avatar, 220);
	const pathImage2 = getImageBySize(userInfo2?.avatar, 220);
	const clickHandler = () => {
		router.push("/live-games/" + props.gameId);
	};
	const goToFirstProfile = () => router.push('/profile/' + userInfo1.login);
	const goToSecondProfile = () => router.push('/profile/' + userInfo2.login);
	return (
		<>
			<div className={classes.liveGameContainer}>
				{props.click && (
					<div className={classes.ButtonWatch} onClick={clickHandler}>
						<div className={classes.Button}>
							<Image src={Play} />
							<div className={classes.WatchGame}>Watch Game</div>
						</div>
					</div>
				)}
				<div className={classes.TypeGame}>{Data?.gameType}</div>
				<div className={classes.GameContent}>
					<div className={classes.UserSection}>
						<div className={classes.userNameAvatar} onClick={goToFirstProfile} >
							<div className={classes.avatar}>
								<img src={pathImage1} />
							</div>
							<div className={classes.userName}>
								{userInfo1.fullname.split(" ")[0]}
							</div>
						</div>
						<div className={classes.ScoreTier}>
							<div className={classes.tierContainer}>
								<Image src={rank1.tier} />
							</div>
							<div className={classes.Score}>
								{Data?.firstScore}
							</div>
						</div>
					</div>
					<div className={classes.vs}>VS</div>
					<div className={classes.UserSectionSecond}>
						<div className={classes.ScoreTier}>
							<div className={classes.Score}>
								{Data?.secondScore}
							</div>
							<div className={classes.tierContainerSecond}>
								<Image src={rank2.tier} />
							</div>
						</div>
						<div className={classes.userNameAvatar} onClick={goToSecondProfile}>
							<div className={classes.secondUserName}>
								{userInfo2.fullname.split(" ")[0]}
							</div>
							<div className={classes.secondavatar}>
								<img src={pathImage2} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

const LiveGames = () => {
	const [liveMatchs, setLiveMatchs] = useState<headerGameType[] | null>(null);
	useEffect(() => {
		socket_game.emit("liveGames");
		socket_game.on("AllGames", (data) => {
			setLiveMatchs(data.arry);
		});
		return () => {
			socket_game.off("AllGames");
		};
	}, []);

	return (
		<>
			<div className={classes.LivegamesContainer}>
				<div className={classes.TitleLiveGame}>Live Games</div>
				<div className={classes.listLiveGames}>
					{liveMatchs &&
						liveMatchs?.map((game) => {
							return (
								<LiveGame
									key={game.gameId}
									click={true}
									gameId={game.gameId}
								/>
							);
						})}
				</div>
			</div>
		</>
	);
};

export default LiveGames;
