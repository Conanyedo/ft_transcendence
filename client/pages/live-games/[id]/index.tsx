import Router from "next/router";
import { useEffect, useState } from "react";
import GameToWatch from "../../../components/liveGame/GameToWatch";
import LoadingElm from "../../../components/loading/Loading_elm";
import ContentWrapper from "../../../components/wrapper/appWrapper";
import socket_game from "../../../config/socketGameConfig";

const WatchGame = () => {
	const [auth, setAuth] = useState(false);
	const { id } = Router.query;
	useEffect(() => {
		if (id) {
			socket_game.emit('checkMatchID', id);
			socket_game.on('MatchNotFound', () => {
				Router.replace('/live-games');
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
			<ContentWrapper
				children={
					<>
						<GameToWatch />
					</>
				}
			/>
		</>
	);
};
export default WatchGame;
