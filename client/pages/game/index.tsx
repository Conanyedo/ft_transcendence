import Game from "../../components/game/Game";
import HomeGame from "../../components/game/HomeGame";
import GameWrapper from "../../components/wrapper/gameWrapper";

const GameHome = () => {
	return (
		<>
			<GameWrapper children={<HomeGame />} />
		</>
	);
};
export default GameHome;
