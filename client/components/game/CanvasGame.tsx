import React, { useEffect, useRef, useState } from "react";
import { render } from "../../config/game";
import { allTheme } from "../../config/gameMap";
import socket_game from "../../config/socketGameConfig";
import { gameControleType } from "../../Types/dataTypes";

const CanvasGame: React.FC<{GameID: string}> = (props) => {
	const gameData: gameControleType = new gameControleType(1500);
	const [newData, setNewData] = useState<gameControleType>(gameData);
	const [isFirst, setisFirst] = useState(false);
	const owner = localStorage.getItem("owner");
	const ref_camvas = useRef(null);
	useEffect(() => {
		gameData.ball.ballX = newData.ball.ballX;
		gameData.ball.ballY = newData.ball.ballY;
		gameData.paddleLeft.paddleY = newData.paddleLeft.paddleY;
		gameData.paddleRight.paddleY = newData.paddleRight.paddleY;
        if (ref_camvas.current && isFirst)
            render(gameData, ref_camvas?.current, allTheme[newData.themeMap]);
	}, [newData]);
	const movePaddle = (ev: KeyboardEvent) => {
		if (ev.key === "ArrowUp")
			socket_game.emit("go_Up", { login: owner });
		else if (ev.key === "ArrowDown")
			socket_game.emit("go_Down", { login: owner });
	}
	const stopPaddle = () => {
		socket_game.emit("stop", { login: owner });
	}
	useEffect(() => {
		socket_game.emit("watchGame", { ID: props.GameID });
		socket_game.on("gameStats", (data) => {
			if (!isFirst)
				setisFirst(true);
			setNewData(data);
		});
		document.addEventListener("keydown", movePaddle);
		document.addEventListener("keyup", stopPaddle);
		return () => {
			socket_game.off("gameStats");
			document.removeEventListener('keydown', movePaddle);
			document.removeEventListener('keyup', stopPaddle);
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
