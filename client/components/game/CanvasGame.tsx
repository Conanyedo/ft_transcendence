import React, { useEffect, useRef, useState } from "react";
import { render } from "../../config/game";
import { allTheme } from "../../config/gameMap";
import socket_game from "../../config/socketGameConfig";
import { gameControleType } from "../../Types/dataTypes";

const CanvasGame: React.FC<{GameID: string}> = (props) => {
	const gameData: gameControleType = new gameControleType(1500);
	const [newData, setNewData] = useState<gameControleType>(gameData);
	const owner = localStorage.getItem("owner");
	const ref_camvas = useRef(null);
	useEffect(() => {
		gameData.ball.ballX = newData.ball.ballX;
		gameData.ball.ballY = newData.ball.ballY;
		gameData.paddleLeft.paddleY = newData.paddleLeft.paddleY;
		gameData.paddleRight.paddleY = newData.paddleRight.paddleY;
        if (ref_camvas.current)
            render(gameData, ref_camvas?.current, allTheme[newData.themeMap]);
	}, [newData]);
	useEffect(() => {
		socket_game.emit("watchGame", { ID: props.GameID });
		socket_game.on("gameStats", (data) => {
			setNewData(data);
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
		};
	}, []);
	return (
		<>
			<canvas
				width={gameData.canvasWidth}
				height={gameData.canvasHieght}
				ref={ref_camvas}
				id="pong"
			></canvas>
		</>
	);
}

export default CanvasGame;
