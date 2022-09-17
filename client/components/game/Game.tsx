import React, { useEffect, useRef, useState } from "react";
import { render } from "../../config/game";
import { ThemeDarkMode, ThemeSky } from "../../config/gameMap";
import Cross from "../../public/ArrowLeft.svg";
import Image from "next/image";
import socket_game from "../../config/socketGameConfig";
import classes from "../../styles/Game.module.css";
import { GameDataType } from "../../Types/dataTypes";
import { LiveGame } from "../liveGame/GameToWatch";
import Router from "next/router";

function Game() {
	const gameData: GameDataType = new GameDataType(1500);
	const [newData, setNewData] = useState<GameDataType>(gameData);
	const owner = localStorage.getItem("owner");
	const ref_camvas = useRef(null);
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
			ref_camvas.current,
			ThemeDarkMode
		);
	}, [newData]);
	useEffect(() => {
		socket_game.on("gameStats", (data) => {
			setNewData(data);
		});
		socket_game.on("GameOver", () => {
			// TODO set Card Winner
			const id = setTimeout(() => {
				Router.replace('/game');
			}, 6000);
			return (() => {
				clearTimeout(id);
			})
		});
		document.addEventListener("keydown", (ev) => {
			if (ev.key === "ArrowUp")
				socket_game.emit("go_Up", { login: owner });
			else if (ev.key === "ArrowDown")
				socket_game.emit("go_Down", { login: owner });
		});
		document.addEventListener("keyup", (ev) => {
			socket_game.emit("stop", { login: owner });
		});
		return () => {
			socket_game.off("gameStats");
			socket_game.off("GameOver");
		};
	}, []);
	const GoBackHandler = () => {
		Router.replace("/game");
	};
	return (
		<>
			<div className={classes.GameContainer}>
				<div className={classes.goBack} onClick={GoBackHandler}>
					<Image src={Cross} />
				</div>
				<LiveGame
					firstScore={newData.myScore}
					secondScore={newData.otherScore}
					firstPlayer={"Choaib Abouelwafa"}
					secondPlayer="Ikram"
					matchType="Classic"
					gameId=""
				/>
				<canvas
					width={gameData.canvasWidth}
					height={gameData.canvasHieght}
					ref={ref_camvas}
					id="pong"
				></canvas>
			</div>
		</>
	);
}

export default Game;
