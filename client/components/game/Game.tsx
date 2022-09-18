import React, { useEffect, useRef, useState } from "react";
import { green, ThemeDarkMode, ThemeSky } from "../../config/gameMap";
import Cross from "../../public/ArrowLeft.svg";
import Image from "next/image";
import socket_game from "../../config/socketGameConfig";
import classes from "../../styles/Game.module.css";
import { useRouter } from "next/router";
import { LiveGame } from "../liveGame/liveGame";
import WinerCard from "./WinerCard";
import CanvasGame from "./CanvasGame";

const Game: React.FC<{ GameID: string }> = (props) => {
	const [showWinner, setShowWinner] = useState("");
	const owner = localStorage.getItem("owner");
	const Router = useRouter();
	useEffect(() => {
		if (props.GameID) {
			socket_game.emit('resumeGame', owner);
			socket_game.on("GameOver", (data) => {
				setShowWinner(data.winner);
				const id = setTimeout(() => {
					Router.replace("/game");
				}, 4000);
				return () => {
					clearTimeout(id);
				};
			});
		}
		return () => {
			socket_game.off("GameOver");
		};
	}, [props.GameID]);
	const GoBackHandler = () => {
		socket_game.disconnect();
		Router.replace("/game");
	};
	return (
		<div className={classes.container}>
			<div className={classes.GameContainer}>
				{showWinner !== "" && <WinerCard showWinner={showWinner} />}
				<div className={classes.goBack} onClick={GoBackHandler}>
					<Image src={Cross} />
				</div>
				{props.GameID !== "" && (
					<LiveGame gameId={props.GameID} click={false} />
				)}
				<CanvasGame GameID={props.GameID} />
			</div>
		</div>
	);
};

export default Game;
