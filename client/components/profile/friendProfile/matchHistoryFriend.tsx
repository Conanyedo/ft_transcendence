import classes from "../../../styles/MatchHistory.module.css";
import { useEffect, useState } from "react";
import { Match } from "../MatchHistory";
import { useRouter } from "next/router";
import { fetchDATA } from "../../../customHooks/useFetchData";
import { HistoryMatchType } from "../../../Types/dataTypes";

const MatchHistoryFriend: React.FC<{ login: string }> = (props) => {
	const [data, setData] = useState<HistoryMatchType[] | null>([]);
	const rout = useRouter();

	useEffect(() => {
		fetchDATA(setData, rout, `game/matchHistory/${props.login}`);
		return () => {
			setData(null);
		};
	}, [props.login]);

	return (
		<div className={classes.history}>
			<div className={classes.titleMatchHistory}>Match History</div>
			<div className={classes.historyMatchCtn}>
				{(data?.length &&
					data?.map((match) => (
						<Match key={Math.random()} {...match} />
					))) || (
					<div className={classes.NoHistory}><span>No Match History</span></div>
				)}
			</div>
		</div>
	);
};

export default MatchHistoryFriend;
