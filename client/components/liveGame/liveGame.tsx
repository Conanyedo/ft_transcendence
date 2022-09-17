import classes from "../../styles/liveGame.module.css";
import Gold from "../../public/Tiers/Gold.svg";
import Play from "../../public/WatchLiveGame.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import socket_game from "../../config/socketGameConfig";
import { liveGamesType } from "../../Types/dataTypes";
import { useRouter } from "next/router";

export const LiveGame: React.FC<liveGamesType> = (props) => {
	const router = useRouter();
	const clickHandler = () => {
		router.push("/live-games/" + props.gameId);
	};
	return (
		<>
			<div className={classes.liveGameContainer}>
				<div className={classes.ButtonWatch} onClick={clickHandler}>
					<div className={classes.Button}>
						<Image src={Play} />
						<div className={classes.WatchGame}>Watch Game</div>
					</div>
				</div>
				<div className={classes.TypeGame}>{props.matchType}</div>
				<div className={classes.GameContent}>
					<div className={classes.UserSection}>
						<div className={classes.userNameAvatar}>
							<div className={classes.avatar}>
								<img src="/uploads/cabouelw1662918372479x70.jpg" />
							</div>
							<div className={classes.userName}>
								Choaib Abouelwafa
							</div>
						</div>

						<div className={classes.ScoreTier}>
							<div className={classes.tierContainer}>
								<Image src={Gold} />
							</div>
							<div className={classes.Score}>
								{props.firstScore}
							</div>
						</div>
					</div>
					<div className={classes.vs}>VS</div>
					<div className={classes.UserSectionSecond}>
						<div className={classes.ScoreTier}>
							<div className={classes.Score}>
								{props.secondScore}
							</div>
							<div className={classes.tierContainerSecond}>
								<Image src={Gold} />
							</div>
						</div>
						<div className={classes.userNameAvatar}>
							<div className={classes.secondUserName}>
								{/* {props.secondPlayer} */}ikram
							</div>
							<div className={classes.secondavatar}>
								<img src="/uploads/watchytb13371662644889624x70.jpg" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

const LiveGames = () => {
	const [liveMatchs, setLiveMatchs] = useState<liveGamesType[] | null>(null);
	useEffect(() => {
		socket_game.connect();
		socket_game.emit("liveGames");
		socket_game.on("AllGames", (data) => {
			console.log("data ", data);
			if (data) setLiveMatchs(data.arry);
		});
		return () => {
			socket_game.off("AllGames");
			// socket_game.disconnect();
		};
	}, []);

	return (
		<>
			<div className={classes.LivegamesContainer}>
				<div className={classes.TitleLiveGame}>Live Games</div>
				<div className={classes.listLiveGames}>
					{liveMatchs &&
						liveMatchs?.map((game) => {
							return <LiveGame {...game} key={game.gameId} />;
						})}
				</div>
			</div>
		</>
	);
};

export default LiveGames;
