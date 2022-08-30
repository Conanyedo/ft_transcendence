import classes from "../../../styles/MatchHistory.module.css";
import profile from "../../../public/profileImage.png";
import axios from "axios";
import { useEffect, useState } from "react";
import { Match } from "../MatchHistory";
import { useRouter } from "next/router";

const MatchHistoryFriend = () => {
	const [fetched, setFetched] = useState(false);
	const [data, setData] = useState<any[]>([]);
    const rout = useRouter();
	let matchs: any[] = [];

	useEffect(() => {
		const fetchData = async () => {
			const data = await axios
				.get(
					`https://test-76ddc-default-rtdb.firebaseio.com/matchs.json`
				)
				.then((res) => {
					res.data.map((dataMatch:any) => {
						matchs.push(dataMatch);
					});
					setFetched(true);
					setData(matchs)
				});
		};
		if (!fetched) fetchData();
	}, []);

	return (
		<div className={classes.history}>
			<div className={classes.titleMatchHistory}>Match History</div>
			<div className={classes.historyMatchCtn}>
				{data && 
					data.map((match) => match &&
						<Match
						Avatar={profile}
						fullName="Anas Elmqas"
						result={match.result}
						datematch={match.date}
						matchRes={match.wonBy === rout.query.id}
					/>
					)}
			</div>
		</div>
	);
};

export default MatchHistoryFriend;
