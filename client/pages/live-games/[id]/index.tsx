import { useEffect } from "react";
import GameToWatch from "../../../components/liveGame/GameToWatch";
import LiveGames from "../../../components/liveGame/liveGame";
import ContentWrapper from "../../../components/wrapper/appWrapper";
import socket_game from "../../../config/socketGameConfig";

const WatchGame = () => {
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
