import { useEffect } from "react";
import Game from "../../../components/game/Game";
import socket_game from "../../../config/socketGameConfig";

const GameHome = () => {
	useEffect(() => {
		return (() => {
			socket_game.disconnect();
		})
	}, [])
	return (
		<>
			<Game />
		</>
	);
};
export default GameHome;
