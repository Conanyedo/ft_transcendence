import classes from "../../styles/MatchHistory.module.css";
import { useEffect, useState } from "react";
import { HistoryMatchType } from "../../Types/dataTypes";
import { useRouter } from "next/router";
import { fetchDATA } from "../../customHooks/useFetchData";


export const Match: React.FC<HistoryMatchType> = (props) => {
	const router = useRouter();
	const profileHandler = () => {
		router.push(`/profile/${props.login}`);
	}
	return (
		<div className={classes.match}>
			<div className={classes.Avatar_name} onClick={profileHandler}>
				<div className={classes.avatar}>
					<img src={props.avatar} />
				</div>
				<div className={classes.dataMatch}>{props.fullname}</div>
			</div>
			<div className={`${classes.dataMatch} ${classes.res}`}>
				{props.yourScore + '/' + props.opponentScore}
			</div>
			<div className={`${classes.dataMatch} ${classes.datedispaly}`}>{props.date}</div>
			<div className={`${(props.yourScore > props.opponentScore) ? classes.won : classes.loss}`}>
				{props.yourScore > props.opponentScore ? "Won" : "Loss"}
			</div>
		</div>
	);
};

const MatchHistory: React.FC = () => {
	const [data, setData] = useState<HistoryMatchType[] | null>([]);
	const rout = useRouter();

	useEffect(() => {
		fetchDATA(setData, rout, `game`);
		return () => {
			setData(null);
		}
	}, []);
	return (
		<div className={classes.history}>
			<div className={classes.titleMatchHistory}>Match History</div>
			<div className={classes.historyMatchCtn}>
				{(data?.length &&
					data?.map((match) =>(<Match
									key={Math.random()}
									{...match}
								/>
							)
					)) || (
					<div className={classes.NoHistory}>
						No Match played Yet
					</div>
				)}
			</div>
		</div>
	);
};

export default MatchHistory;
