import Image from "next/image";
import classes from "../../styles/GameLobby.module.css";
import { LiveGame } from "../liveGame/GameToWatch";
import { GameDataType } from "../../Types/dataTypes";
import React, { useEffect, useRef, useState } from "react";
import { ThemeDarkMode } from "../../config/gameMap";
import { render } from "../../config/game";
import socket_game from "../../config/socketGameConfig";
import Router from "next/router";

export const LoadingGame = () => {
	return (
		<>
			<div className={classes.Loading}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</>
	);
};

const GameLobby: React.FC<{ close: () => void }> = (props) => {
	const gameData: GameDataType = new GameDataType(1500);
	const ref_canvas = useRef(null);
	useEffect(() => {
		const owner = localStorage.getItem("owner");
		socket_game.emit("joinGameFriend", { login: owner });
		socket_game.on("getCode", (data) => {
			Router.push('/game/' + data);
		});
		render(gameData, ref_canvas.current, ThemeDarkMode);
	}, []);
	const cancelHandler = () => {
		props.close();
	};
	return (
		<>
			<div className={classes.BackGround}>
				<div className={classes.Waiting}>
					<LoadingGame />
					<span>Waiting for your opponent</span>
					<div className={classes.cancelbtn} onClick={cancelHandler}>
						Cancel
					</div>
				</div>
			</div>
			<div className={classes.GameContainer}>
				<LiveGame
					firstScore={0}
					secondScore={0}
					firstPlayer={"Choaib Abouelwafa"}
					secondPlayer="Ikram"
					matchType="Rank"
					gameId=""
				/>
				<canvas
					width={gameData.canvasWidth}
					height={gameData.canvasHieght}
					ref={ref_canvas}
					id="pong"
				></canvas>
			</div>
		</>
	);
};

export default GameLobby;
