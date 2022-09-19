import Router from "next/router";
import { useEffect, useState } from "react";
import Game from "../../../components/game/Game";
import LoadingElm from "../../../components/loading/Loading_elm";
import socket_game from "../../../config/socketGameConfig";

const GameHome = () => {
	const [auth, setAuth] = useState(false);
	const { id } = Router.query;
	useEffect(() => {
		if (id) {
			socket_game.emit("checkMatchID", id);
			socket_game.on("MatchNotFound", () => {
				Router.replace("/game");
				socket_game.disconnect();
			});
		}
		if (id)
			setTimeout(() => {
				socket_game.emit("liveGames");
				setAuth(true);
			}, 200);
		return () => {
			socket_game.off("MatchNotFound");
		};
	}, [id]);
	if (!auth) return <LoadingElm />;
	return <>{auth && <Game GameID={id as string} />}</>;
};
export default GameHome;
