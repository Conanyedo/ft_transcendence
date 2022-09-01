import React, { useEffect, useRef } from "react";
import classes from "../../styles/Game.module.css";

function Game() {
	const ref_canvas = useRef(null);

	useEffect(() => {
		// const canvas_elm = ref_canvas.current;
		// var c = document.getElementById("canvasElm");
		// var ctx = c.getContext("2d");
		// ctx.shadowColor = "black";
		// ctx.fillStyle = "red";
		// ctx.fillRect(20, 20, 500, 500);
		// console.log(draw);
	}, []);

	return (
		<div className={classes.GameContainer}>
			<canvas className={classes.canvas} ref={ref_canvas} id='canvasElm' />
		</div>
	);
}

export default Game;
