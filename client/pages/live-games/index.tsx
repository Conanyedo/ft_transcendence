import { useEffect } from "react";
import LiveGames from "../../components/liveGame/liveGame";
import ContentWrapper from "../../components/wrapper/appWrapper";
import socket_game from "../../config/socketGameConfig";

const Game = () => {
	return (
		<>
			<ContentWrapper children={
				<>
				<LiveGames />
				</>
			}/>
		</>
	);
};
export default Game;
