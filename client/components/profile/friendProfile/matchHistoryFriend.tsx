import classes from "../../../styles/MatchHistory.module.css";
import profile from "../../../public/profileImage.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { Match } from "../MatchHistory";
import { useRouter } from "next/router";
import { fetchDATA } from "../../../customHooks/useFetchData";
import { HistoryMatchType } from "../../../Types/dataTypes";

const MatchHistoryFriend: React.FC<{login: string}> = (props) => {
	const [data, setData] = useState<HistoryMatchType[] | null>([]);
	const rout = useRouter();

	useEffect(() => {
		fetchDATA(setData, rout, `game/${props.login}`);
		return () => {
			setData(null);
		}
	}, [props.login]);

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

export default MatchHistoryFriend;
