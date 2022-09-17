import classes from "../../../styles/PendingList.module.css";
import React, { useEffect, useState } from "react";
import { UserTypeNew } from "../../../Types/dataTypes";
import { useRouter } from "next/router";
import { fetchDATA, requests } from "../../../customHooks/useFetchData";
import LoadingElm from "../../loading/Loading_elm";
import { getImageBySize } from "../../../customHooks/Functions";

class types extends UserTypeNew {
	refresh: any
}

const Pendingfriend: React.FC<types> = (props) => {
	const router = useRouter();
	const Clickhandler = () => router.push("/profile/" + props.login);
	const acceptHandler = async () => {
		await requests(props.login, "friendship/acceptRequest", router);
		props.refresh();
	};
	const refuseHandler = async () => {
		await requests(props.login, "friendship/refuseRequest", router);
		props.refresh();
	};
	const pathImage = getImageBySize(props.avatar, 70);
	return (
		<div className={classes.friend}>
			<div className={classes.Avatar_name} onClick={Clickhandler}>
				<div className={classes.avatar}>
					<img src={pathImage} />
				</div>
				<div className={classes.friendName}>{props.fullname}</div>
			</div>
			<div className={classes.optionFriend}>
				<div className={classes.sendMsg} onClick={acceptHandler}>Accept</div>
				<div className={`${classes.sendMsg}`} onClick={refuseHandler}>Refuse</div>
			</div>
		</div>
	);
};

const PendingList: React.FC<{search: string}> = (props) => {
	const [listPanding, setListPanding] = useState<UserTypeNew[] | null>(null);
	const router = useRouter();
	const [isUp, SetIsUp] = useState(false);
	const refresh = () => fetchDATA(setListPanding, router, "friendship/requests");
	useEffect(() => {
		fetchDATA(setListPanding, router, "friendship/requests");
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
								return <Pendingfriend {...friend} key={Math.random()} refresh={refresh} />
							else if (friend.fullname.toLocaleLowerCase().includes(props.search.toLocaleLowerCase()))
								return <Pendingfriend {...friend} key={Math.random()} refresh={refresh} />
						})) || (
						<div className={classes.noRequest}>No request Yet</div>
					)}
				</div>
			)}
		</>
	);
};

export default PendingList;
