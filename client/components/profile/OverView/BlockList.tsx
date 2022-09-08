import classes from "../../../styles/BlockList.module.css";
import { useEffect, useState } from "react";
import { UserTypeNew } from "../../../Types/dataTypes";
import { useRouter } from "next/router";
import { fetchDATA, requests } from "../../../customHooks/useFetchData";
import LoadingElm from "../../loading/Loading_elm";
import { getImageBySize } from "../../../customHooks/Functions";

class types extends UserTypeNew {
	refresh: any
}

const BlockedUser: React.FC<types> = (props) => {
	const router = useRouter();
	const UnblockHandler = async () => {
		await requests(props.login, "friendship/unblock", router);
		props.refresh();
	};
	const pathImage = getImageBySize(props.avatar, 70);
	return (
		<div className={classes.friend}>
			<div className={classes.Avatar_name}>
				<div className={classes.avatar}>
					<img src={pathImage} />
				</div>
				<div className={classes.friendName}>{props.fullname}</div>
			</div>
			<div className={`${classes.sendMsg}`} onClick={UnblockHandler}>
				Unblock
			</div>
		</div>
	);
};

const BlockList: React.FC<{ search: string }> = (props) => {
	const [listblock, setListblock] = useState<UserTypeNew[] | null>(null);
	const [isUp, SetIsUp] = useState(false);
	const router = useRouter();
	const refresh = () => fetchDATA(setListblock, router, "friendship/blocked");
	useEffect(() => {
		fetchDATA(setListblock, router, "friendship/blocked");
		SetIsUp(true);
		return () => {
			setListblock(null);
		};
	}, []);

	if (!isUp) {
		return (
			<div className={classes.listFriends}>
				<LoadingElm />
			</div>
		);
	}

	return (
		<>
			{isUp && (
				<div className={classes.listFriends}>
					{(listblock?.length &&
						listblock?.map((user) => {
							if (props.search === "")
								return (
									<BlockedUser
										{...user}
										key={Math.random()}
										refresh={refresh}
									/>
								);
							else if (
								user.fullname
									.toLocaleLowerCase()
									.includes(props.search.toLocaleLowerCase())
							)
								return (
									<BlockedUser
										{...user}
										key={Math.random()}
										refresh={refresh}
									/>
								);
						})) || (
						<div className={classes.noBlockers}>Not Yet</div>
					)}
				</div>
			)}
		</>
	);
};

export default BlockList;
