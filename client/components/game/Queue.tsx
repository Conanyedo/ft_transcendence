import Image from "next/image";
import Router from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import socket_game from "../../config/socketGameConfig";
import { getRankUser } from "../../customHooks/Functions";
import classes from "../../styles/Queue.module.css";
import { LoadingGame } from "./GameLobby";

const CardPlayer: React.FC<{ Loading: boolean }> = ({ Loading }) => {
	const rank = getRankUser(1600);
	return (
		<>
			<div className={classes.Card}>
				{(Loading && (
					<>
						<LoadingGame />
						<p>Waiting for player ...</p>
					</>
				)) || (
					<>
						<div className={classes.items}>
							<div className={classes.imgContainer}>
								<img src="https://cdn.intra.42.fr/users/cabouelw.jpg" />
							</div>
							<div className={classes.NAme}>Youness Santir</div>
						</div>
						<div className={classes.items}>
							<div className={classes.imgContainer}>
								<Image src={rank.tier} />
							</div>
							<div className={classes.rank}>Rank 5</div>
						</div>
					</>
				)}
			</div>
		</>
	);
};

const Queue: React.FC<{ cancel: Dispatch<SetStateAction<boolean>> }> = ({
	cancel,
}) => {
	const [waiting, setWaiting] = useState(true);
	const owner = localStorage.getItem("owner");
	useEffect(() => {
		socket_game.connect();
		socket_game.emit('joinGame', owner);
		socket_game.on("getCode", (data) => {
			setWaiting(false)
			const time = setTimeout(() => {
				Router.push('/game/' + data);
			}, 5000);
			return () => {
				clearTimeout(time);
			}
		});
		return () => {
			socket_game.off('getCode');
		};
	}, []);
	const GoBackHandler = () => {
		socket_game.emit('leaveQueue', owner);
		cancel(false);
	};
	return (
		<>
			<div className={classes.GameQueueContainer}>
				<h1>Game Queue</h1>
				<p>
					You have been placed in the queue to play a ranked game.
					<br />
					Thank you for your patience.
				</p>
				<div className={classes.CardsContainer}>
					<CardPlayer Loading={false} />
					<CardPlayer Loading={waiting} />
				</div>
				{waiting && (
					<div className={classes.btnLeave} onClick={GoBackHandler}>
						Leave Queue
					</div>
				)}
			</div>
		</>
	);
};

export default Queue;
