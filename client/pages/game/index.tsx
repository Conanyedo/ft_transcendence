import Game from "../../components/game/Game";
import Lobby from "../../components/game/Lobby";
import ContentWrapper from "../../components/wrapper/appWrapper";
import GameWrapper from "../../components/wrapper/gameWrapper";

const GameHome = () => {
	return (
		<>
			<ContentWrapper children={<Lobby />} />
		</>
	);
};
export default GameHome;
