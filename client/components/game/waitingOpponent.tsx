import classes from "../../styles/WaitingOpponent.module.css";
import classesELM from "../../styles/Loading.module.css";

const WaitingOpponent = () => {
	return (
		<>
			<div className={classes.background}>
				<div className={classes.waitingContainer}>
					<div className={`${classesELM["pong-loader"]} ${classes.loading}`} />
					<p>Waiting for your opponent</p>
				</div>
			</div>
		</>
	);
};

export default WaitingOpponent;
