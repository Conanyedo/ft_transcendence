import classes from "../../styles/liveGame.module.css";
import Gold from "../../public/Tiers/Gold.svg";
import Play from "../../public/WatchLiveGame.svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GameDataType, liveGamesType } from "../../Types/dataTypes";
import { useRouter } from "next/router";
import { render } from "../../config/game";
import { ThemeDarkMode, ThemeSky } from "../../config/gameMap";
import socket_game from "../../config/socketGameConfig";

export const LiveGame: React.FC<liveGamesType> = (props) => {
	const router = useRouter();
	return (
		<>
			<div className={classes.liveGameContainer}>
				<div className={classes.TypeGame}>{props.matchType}</div>
				<div className={classes.GameContent}>
					<div className={classes.UserSection}>
						<div className={classes.userNameAvatar}>
							<div className={classes.avatar}>
								<img src="/uploads/cabouelw1662918372479x70.jpg" />
							</div>
							<div className={classes.userName}>
								Choaib
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

const GameToWatch = () => {
	const gameData: GameDataType = new GameDataType(1500);
	const [newData, setNewData] = useState<GameDataType>(gameData);
	const router = useRouter();
	const ref_canvas = useRef(null);
	useEffect(() => {
		socket_game.emit("watchGame", { ID: router.query.id });
		socket_game.on("gameStats", (data) => {
			setNewData(data);
		});
		return () => {
			socket_game.emit("exitFromSocket", { ID: router.query.id });
			socket_game.off("gameStats");
		};
	}, []);
	useEffect(() => {
		gameData.ball.ballX = newData.ball.ballX;
		gameData.ball.ballY = newData.ball.ballY;
		gameData.myScore = newData.myScore;
		gameData.otherScore = newData.otherScore;
		gameData.paddleLeft.paddleY = newData.paddleLeft.paddleY;
		gameData.paddleRight.paddleY = newData.paddleRight.paddleY;
		gameData.GameStatus = newData.GameStatus;
		render(
			gameData,
			ref_canvas.current,
			Math.floor(Math.random() * 2) + 1 > 0 ? ThemeSky : ThemeDarkMode
		);
	}, [newData]);
	return (
		<div className={classes.GameContainerOutside}>
			<LiveGame
				firstPlayer="Choaib Abouelwafa"
				secondPlayer="Ikram"
				firstScore={newData.myScore}
				secondScore={newData.otherScore}
				matchType="classic"
				gameId="s"
			/>
			<canvas
				width={gameData.canvasWidth}
				height={gameData.canvasHieght}
				ref={ref_canvas}
				id="pong"
			></canvas>
			ß
		</div>
	);
};
export default GameToWatch;
