import Image from "next/image";
import classes from "../../styles/MatchHistory.module.css";
import profile from "../../public/profileImage.png";
import axios from "axios";
import { useEffect, useState } from "react";

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

const MatchHistory: React.FC<{id: string}> = (props) => {
	const [fetched, setFetched] = useState(false);
	const [data, setData] = useState<any[]>([])
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
						key={Math.random()}
						Avatar={profile}
						fullName="Anas Elmqas"
						result={match.result}
						datematch={match.date}
						matchRes={match.wonBy === window.localStorage.getItem('owner')}
					/>
					)}
			</div>
		</div>
	);
};

export default MatchHistory;
