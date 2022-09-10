import React, { useEffect, useRef, useState } from "react";
import { render } from "../../config/game";
import { Theme } from "../../config/gameMap";
import socket_game from "../../config/socketGameConfig";
import classes from "../../styles/Game.module.css";
import { GameDataType } from "../../Types/dataTypes";

function Game() {
	const gameData: GameDataType = new GameDataType(1500, 900);
	const [newData, setNewData] = useState<GameDataType>(gameData);
	const owner = localStorage.getItem("owner");
	const ref_camvas = useRef(null);
	const theme = new Theme("black", "white", "blue", "red", "white", 'white')
	useEffect(() => {
		gameData.ball.ballX = newData.ball.ballX;
		gameData.ball.ballY = newData.ball.ballY;
		gameData.myScore = newData.myScore;
		gameData.otherScore = newData.otherScore;
		gameData.paddleLeft.paddleY = newData.paddleLeft.paddleY;
		gameData.paddleRight.paddleY = newData.paddleRight.paddleY;
		gameData.GameStatus = newData.GameStatus;
		render(gameData, ref_camvas.current, theme);
	}, [newData]);
	socket_game.on("gameStats", (data) => {
		setNewData(data);
	});
	useEffect(() => {
		document.addEventListener("keydown", (ev) => {
			if (ev.key === "ArrowUp")
				socket_game.emit("go_Up", { login: owner });
			else if (ev.key === "ArrowDown")
				socket_game.emit("go_Down", { login: owner });
		});
		document.addEventListener('keyup', (ev) => {
			console.log(ev.key);
			socket_game.emit("stop", { login: owner });
		});
	}, []);

	return (
		<>
			<div className={classes.GameContainer}>
				<canvas
					width={gameData.canvasWidth}
					height={gameData.canvasHieght}
					ref={ref_camvas}
					id="pong"
				></canvas>
			</div>
			<div id="pause">Pause</div>
		</>
	);
}

export default Game;
