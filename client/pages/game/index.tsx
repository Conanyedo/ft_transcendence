import Game from "../../components/game/Game";
import GameWrapper from "../../components/wrapper/gameWrapper";

const GameHome = () => {
	return (
		<>
			<GameWrapper children={<Game />} />
		</>
	);
};
export default GameHome;
