import classes from "../../styles/WaitingOpponent.module.css";
import { LoadingGame } from "./GameLobby";

const WaitingOpponent = () => {
	return (
		<>
			<div className={classes.background}>
				<div className={classes.waitingContainer}>
                    <LoadingGame />
                    <p>Waiting for your opponent</p>
                </div>
			</div>
		</>
	);
};

export default WaitingOpponent;
