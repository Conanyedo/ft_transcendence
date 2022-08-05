import Image from "next/image";

import classes from "../../styles/MatchHistory.module.css";
import profile from "../../public/profileImage.png";

interface matchDataType {
	Avatar: any;
	fullName: string;
    result: string;
    datematch: string;
    matchRes: boolean;
}

const Match: React.FC<matchDataType> = (props) => {
	return (
		<div className={classes.match}>
			<div className={classes.Avatar_name}>
				<div className={classes.avatar}>
					<Image src={props.Avatar} />
				</div>
				<div className={classes.dataMatch}>{props.fullName}</div>
			</div>
			<div className={`${classes.dataMatch} ${classes.res}`}>{props.result}</div>
			<div className={`${classes.dataMatch}`}>{props.datematch}</div>
			<div className={`${(props.matchRes) ? classes.won : classes.loss }`}>{(props.matchRes) ? 'Won' : 'Loss'}</div>
		</div>
	);
};

const MatchHistory = () => {
	return (
		<div className={classes.history}>
			<div className={classes.titleMatchHistory}>Match History</div>
            <div className={classes.historyMatchCtn} >
                <Match Avatar={profile} fullName='Anas Elmqas' result="15 / 10" datematch="10/15/2022" matchRes={true} />
                <Match Avatar={profile} fullName='Hasna Elhafi' result="15 / 10" datematch="10/15/2022" matchRes={false} />
                <Match Avatar={profile} fullName='Fati Fleur'result="15 / 10" datematch="10/15/2022" matchRes={true} />
                <Match Avatar={profile} fullName='Asmae Lmkhantar'result="15 / 10" datematch="10/15/2022" matchRes={false} />
                <Match Avatar={profile} fullName='Yassine Karma'result="15 / 10" datematch="10/15/2022" matchRes={false} />
                <Match Avatar={profile} fullName='Anas Elmqas' result="15 / 10" datematch="10/15/2022" matchRes={true} />
                <Match Avatar={profile} fullName='Hasna Elhafi' result="15 / 10" datematch="10/15/2022" matchRes={false} />
                <Match Avatar={profile} fullName='Fati Fleur'result="15 / 10" datematch="10/15/2022" matchRes={true} />
                <Match Avatar={profile} fullName='Asmae Lmkhantar'result="15 / 10" datematch="10/15/2022" matchRes={false} />
                <Match Avatar={profile} fullName='Yassine Karma'result="15 / 10" datematch="10/15/2022" matchRes={false} />
            </div>
		</div>
	);
};

export default MatchHistory;
