import classes from "../../styles/liveGame.module.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GameDataType } from "../../Types/dataTypes";
import { useRouter } from "next/router";
import { render } from "../../config/game";
import { allTheme, ThemeDarkMode, ThemeSky } from "../../config/gameMap";
import socket_game from "../../config/socketGameConfig";
import { LiveGame } from "./liveGame";
import WinerCard from "../game/WinerCard";
import CanvasGame from "../game/CanvasGame";


const GameToWatch = () => {
	const gameData: GameDataType = new GameDataType(1500);
	const [staticData, setStaticData] = useState<GameDataType>(gameData);
	const [showWinner, setShowWinner] = useState("");
	const router = useRouter();
	useEffect(() => {
		socket_game.on("GameOver", (data) => {
			setShowWinner(data.winner);
			setTimeout(() => {
				router.replace("/live-games");
			}, 4000);
		});
		socket_game.on("infoGame", (data) => {
			setStaticData(data);
		});
		return () => {
			socket_game.emit("exitFromSocket", { ID: router.query.id });
			socket_game.off("GameOver");
			socket_game.off("infoGame");
		};
	}, []);
	return (
		<div className={classes.container}>
		<div className={classes.GameContainerOutside}>
			{showWinner !== "" && <WinerCard showWinner={showWinner} />}
			<LiveGame
				gameId={staticData.gameID}
				click={false}
			/>
			<CanvasGame GameID={staticData.gameID}/>
		</div></div>
	);
};
export default GameToWatch;
