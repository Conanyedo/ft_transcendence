import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GameToWatch from "../../../components/liveGame/GameToWatch";
import LoadingElm from "../../../components/loading/Loading_elm";
import socket_game from "../../../config/socketGameConfig";

const WatchGame = () => {
	const [auth, setAuth] = useState(false);
	const router = useRouter();
	const { id } = router.query;
	useEffect(() => {
		if (id) {
			socket_game.emit('checkMatchID', id);
			socket_game.on('MatchNotFound', () => {
				router.replace('/live-games');
				socket_game.disconnect();
			})
		}
		if (id)
			setTimeout(() => setAuth(true), 200)
		return (() => {
			socket_game.off('MatchNotFound');
		})
	}, [id])
	if (!auth) return <LoadingElm />;
	return (
		<>
			<GameToWatch />
		</>
	);
};
export default WatchGame;
