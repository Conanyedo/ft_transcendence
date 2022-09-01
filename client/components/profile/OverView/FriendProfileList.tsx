import classes from "../../../styles/FriendList.module.css";
import Image from "next/image";

import Search from "../../../public/SearchIcon.svg";
import ListFriends from "./ListFriends";
import PendingList from "./PendingList";
import { useRef, useState } from "react";
import BlockList from "./BlockList";
import { motion } from "framer-motion";

let friendClass = `${classes.btnFriend}  ${classes.btnSelected}`;
let pendingClass = `${classes.btnFriend} `;
let blockClass = `${classes.btnFriend} `;

const SearchFriend: React.FC<{ ref_input: any; searchHandler: () => void }> = (
	props
) => {
	const [isOpen, setIsOpen] = useState(false);
	const ClickHandler = () => {
		if (props.ref_input.current.value === "") setIsOpen((value) => !value);
		else props.searchHandler();
	};
	return (
		<form
			action="#"
			className={`${classes.searchCtn} ${
				!isOpen ? classes.resizeCtnSearch : ""
			}`}
		>
			<div className={classes.btnSearch} onClick={ClickHandler}>
				<Image src={Search} />
			</div>
			<input
				type="text"
				className={`${!isOpen ? classes.hideSearch : classes.search}`}
				ref={props.ref_input}
			/>
		</form>
	);
};

const FriendProfileList = () => {
	const [indexCtn, setIndexCtn] = useState(0);
	const ref_input = useRef(null);

	const FirendListHandler = () => {
		setIndexCtn(0);
		friendClass = `${classes.btnFriend}  ${classes.btnSelected}`;
		pendingClass = classes.btnFriend;
		blockClass = classes.btnFriend;
	};
	const PendingListHandler = () => {
		setIndexCtn(1);
		pendingClass = `${classes.btnFriend}  ${classes.btnSelected}`;
		friendClass = classes.btnFriend;
		blockClass = classes.btnFriend;
	};
	const BlockedListHandler = () => {
		setIndexCtn(2);
		blockClass = `${classes.btnFriend}  ${classes.btnSelected}`;
		pendingClass = classes.btnFriend;
		friendClass = classes.btnFriend;
	};
	const searchHandler = () => {
		console.log(ref_input.current!["value"]);
	};
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
							onClick={PendingListHandler}
							className={pendingClass}
						>
							Pending
						</div>
						<div
							onClick={BlockedListHandler}
							className={blockClass}
						>
							Blocked Users
						</div>
					</div>
					<SearchFriend
						ref_input={ref_input}
						searchHandler={searchHandler}
					/>
				</div>
				<motion.div
					key={indexCtn ? indexCtn : "empty"}
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -10, opacity: 0 }}
					transition={{ duration: .5 }}
				>
					{
						(indexCtn === 0 && <ListFriends />) || //TODO filter with ref_input.current.value
							(indexCtn === 1 && <PendingList />) || //TODO filter with ref_input.current.value
							(indexCtn === 2 && <BlockList />) //TODO filter with ref_input.current.value
					}
				</motion.div>
			</div>
		</div>
	);
};

export default FriendProfileList;
