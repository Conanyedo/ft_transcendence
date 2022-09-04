import Image from "next/image";
import classes from "../../styles/MatchHistory.module.css";
import profile from "../../public/profileImage.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { HistoryMatchType } from "../../Types/dataTypes";
import { useRouter } from "next/router";
import { fetchDATA } from "../../customHooks/useFetchData";

interface matchDataType {
	Avatar: any;
	fullName: string;
	result: string;
	datematch: string;
	matchRes: boolean;
}

export const Match: React.FC<matchDataType> = (props) => {
	return (
		<div className={classes.match}>
			<div className={classes.Avatar_name}>
				<div className={classes.avatar}>
					<Image src={props.Avatar} />
				</div>
				<div className={classes.dataMatch}>{props.fullName}</div>
			</div>
			<div className={`${classes.dataMatch} ${classes.res}`}>
				{props.result}
			</div>
			<div className={`${classes.dataMatch} ${classes.datedispaly}`}>{props.datematch}</div>
			<div className={`${props.matchRes ? classes.won : classes.loss}`}>
				{props.matchRes ? "Won" : "Loss"}
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
									// Avatar={match.avatar}
									key={Math.random()}
									Avatar={profile}
									fullName={match.opponent}
									result={`${match.yourScore}/${match.opponentScore}`}
									datematch={match.data}
									matchRes={match.yourScore > match.opponentScore}
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
