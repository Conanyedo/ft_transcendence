import classes from "../../../styles/BlockList.module.css";
import { useEffect, useState } from "react";
import { UserTypeNew } from "../../../Types/dataTypes";
import { useRouter } from "next/router";
import { fetchDATA } from "../../../customHooks/useFetchData";
import LoadingElm from "../../loading/Loading_elm";

const BlockedUser: React.FC<UserTypeNew> = (props) => {
	const route = useRouter();
	const Clickhandler = () => route.push("/profile/" + props.id);
	return (
		<div className={classes.friend}>
			<div className={classes.Avatar_name} onClick={Clickhandler}>
				<div className={classes.avatar}>
					<img src={props.avatar} />
				</div>
				<div className={classes.friendName}>{props.fullname}</div>
			</div>
			<div className={`${classes.sendMsg}`}>Unblock</div>
		</div>
	);
};

const BlockList: React.FC<{search: string}> = (props) => {
	const [listblock, setListblock] = useState<UserTypeNew[] | null>(null);
	const [isUp, SetIsUp] = useState(false);
	const router = useRouter();
	useEffect(() => {
		fetchDATA(setListblock, router, "friendship/blocked");
		SetIsUp(true);
		return () => {
			setListblock(null);
		};
	}, []);

	if (!isUp) {
		return <div className={classes.listFriends}>
			<LoadingElm />
		</div>
	}

	return (
		<>
			{isUp && (
				<div className={classes.listFriends}>
					{(listblock?.length &&
						listblock?.map((user) => {
							if (props.search === '')
								return <BlockedUser {...user} key={Math.random()} />
							else if (user.fullname.toLocaleLowerCase().includes(props.search.toLocaleLowerCase()))
								return <BlockedUser {...user} key={Math.random()} />
						})) || (
						<div className={classes.noBlockers}>Not Yet</div>
					)}
				</div>
			)}
		</>
	);
};

export default BlockList;
