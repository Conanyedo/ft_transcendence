import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import socket_game from "../../config/socketGameConfig";
import classes from "../../styles/Game.module.css";
import LoadingElm from "../loading/Loading_elm";
import Game from "./Game";
import { motion } from "framer-motion";

const HomeGame = () => {
	const [start, setStart] = useState(true);
	const [startSoon, setStartSoon] = useState(false);
	const [loading, setLoading] = useState(false);
	const owner = localStorage.getItem("owner");
	const JoinHandler = () => {
		socket_game.emit("joinGame", { login: owner });
		setLoading(true);
	};
	useEffect(() => {
		socket_game.on("startsoon", (data) => {
			setStart(false);
            setStartSoon(true);
            setTimeout(() => {
                setLoading(false);
                setStartSoon(false);
            }, 5000)
		});
	}, []);

	return (
		<>
			{loading && !startSoon && <LoadingElm />}
            {startSoon && <motion.div  className={classes.msgStart}><span>Are You Ready</span></motion.div>}
			{start && !loading && (
				<div className={classes.homeGameContainer}>
					<div className={classes.joinGame} onClick={JoinHandler}>
						Join Game
					</div>
				</div>
			)}
			{!start && !loading && <Game />}
		</>
	);
};

export default HomeGame;
