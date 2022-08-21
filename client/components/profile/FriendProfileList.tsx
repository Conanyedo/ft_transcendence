import classes from "../../styles/FriendList.module.css";
import Image from "next/image";

import Search from "../../public/Icon.svg";
import ListFriends from "./ListFriends";
import PendingList from "./PendingList";
import { useState } from "react";
import BlockList from "./BlockList";

let friendClass = `${classes.btnFriend}  ${classes.btnSelected}`;
let pendingClass = `${classes.btnFriend} `;
let blockClass = `${classes.btnFriend} `;

const FriendProfileList = () => {
	const [indexCtn, setIndexCtn] = useState(0);

	const FirendListHandler = () => {
		setIndexCtn(0);
		friendClass =`${classes.btnFriend}  ${classes.btnSelected}`;
		pendingClass = classes.btnFriend;
		blockClass = classes.btnFriend;
	};
	const PendingListHandler = () => {
		setIndexCtn(1)
		pendingClass =`${classes.btnFriend}  ${classes.btnSelected}`;
		friendClass = classes.btnFriend;
		blockClass = classes.btnFriend;
	}
	const BlockedListHandler = () => {
		setIndexCtn(2);
		blockClass =`${classes.btnFriend}  ${classes.btnSelected}`;
		pendingClass = classes.btnFriend;
		friendClass = classes.btnFriend;
	}
	return (
		<div className={classes.FriendCtn}>
		<div className={classes.friends}>
			<div className={classes.friendHeader}>
				<div className={classes.btnCtn}>
					<div
						onClick={FirendListHandler}
						className={friendClass}
					>
						Friend List
					</div>
					<div 
						onClick={PendingListHandler} className={pendingClass}>Pending</div>
					<div 
						onClick={BlockedListHandler} className={blockClass}>
						Blocked Users
					</div>
				</div>
				<form action="#" className={classes.searchCtn}>
					<input type="text" className={classes.search} />
					<div className={classes.btnSearch}>
						<Image src={Search} />
					</div>
				</form>
			</div>
			{indexCtn === 0 && <ListFriends /> ||
			indexCtn === 1 && <PendingList /> ||
			indexCtn === 2 && <BlockList />}
		</div></div>
	);
};

export default FriendProfileList;
