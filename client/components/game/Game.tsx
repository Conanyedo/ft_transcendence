import React, { useEffect, useRef } from "react";
import { gameMap } from "../../customHooks/game";
import classes from "../../styles/Game.module.css";

let x = 0;
let y = 0;

function Game() {
	useEffect(() => {
		gameMap();
	}, []);

	return (
		<>
			<div className={classes.GameContainer}>
				<canvas
					id="pong"
					className={classes.Game}
					width={window.innerWidth}
					height={window.innerHeight / 2}
				></canvas>
			</div>
			<div id="pause">Pause</div>
		</>
	);
}

export default Game;
