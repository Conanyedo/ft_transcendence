import classes from "../../../styles/PendingList.module.css";
import React, { useEffect, useState } from "react";
import { UserTypeNew } from "../../../Types/dataTypes";
import { useRouter } from "next/router";
import { fetchDATA } from "../../../customHooks/useFetchData";
import LoadingElm from "../../loading/Loading_elm";

const Pendingfriend: React.FC<UserTypeNew> = (props) => {
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
			<div className={classes.optionFriend}>
				<div className={classes.sendMsg}>Accept</div>
				<div className={`${classes.sendMsg}`}>Refuse</div>
			</div>
		</div>
	);
};

const PendingList: React.FC<{search: string}> = (props) => {
	const [listPanding, setListPanding] = useState<UserTypeNew[] | null>(null);
	const router = useRouter();
	const [isUp, SetIsUp] = useState(false);
	useEffect(() => {
		fetchDATA(setListPanding, router, "friendship/pendings");
		SetIsUp(true);
		return () => {
			setListPanding(null);
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
					{(listPanding?.length &&
						listPanding?.map((friend) => {
							if (props.search === '')
								return <Pendingfriend {...friend} key={Math.random()} />
							else if (friend.fullname.toLocaleLowerCase().includes(props.search.toLocaleLowerCase()))
								return <Pendingfriend {...friend} key={Math.random()} />
						})) || (
						<div className={classes.noRequest}>No request Yet</div>
					)}
				</div>
			)}
		</>
	);
};

export default PendingList;
