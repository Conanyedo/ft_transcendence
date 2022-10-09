import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Game from "../../../components/game/Game";
import LoadingElm from "../../../components/loading/Loading_elm";
import socket_game from "../../../config/socketGameConfig";

const GameHome = () => {
	const [auth, setAuth] = useState(false);
	const [isMounted, setisMounted] = useState(false);
	const router = useRouter();
	const { id } = router.query;
	useEffect(() => {
		if (id) {
			socket_game.emit("checkMatchID", id);
			socket_game.on("MatchNotFound", () => {
				router.replace("/game");
				socket_game.disconnect();
			});
		}
		if (id){
			setTimeout(() => {
				socket_game.emit("liveGames");
				setAuth(true);
			}, 200);
		if (!isMounted) setisMounted(true);}
		return () => {
			socket_game.off("MatchNotFound");
		};
	}, [id]);

	if (!auth) return <LoadingElm />;
	return <>{auth && isMounted && <Game GameID={id as string} />}</>;
};
export default GameHome;
