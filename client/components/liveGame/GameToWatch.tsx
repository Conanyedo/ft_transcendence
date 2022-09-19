import classes from "../../styles/liveGame.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import socket_game from "../../config/socketGameConfig";
import { LiveGame } from "./liveGame";
import WinerCard from "../game/WinerCard";
import CanvasGame from "../game/CanvasGame";


const GameToWatch = () => {
	const [gameID, setgameID] = useState('');
	const [showWinner, setShowWinner] = useState("");
	const router = useRouter();
	useEffect(() => {
		socket_game.emit("watchGame", { ID: router.query.id });
		setgameID(router.query.id as string);
		socket_game.on("GameOver", (data) => {
			setShowWinner(data.winner);
			setTimeout(() => {
				router.replace("/live-games");
			}, 4000);
		});
		return () => {
			socket_game.emit("exitFromSocket", { ID: router.query.id });
			socket_game.off("GameOver");
		};
	}, []);
	return (
		<div className={classes.container}>
		<div className={classes.GameContainerOutside}>
			{showWinner !== "" && <WinerCard showWinner={showWinner} />}
			<LiveGame
				gameId={gameID}
				click={false}
			/>
			<CanvasGame GameID={gameID}/>
		</div></div>
	);
};
export default GameToWatch;
