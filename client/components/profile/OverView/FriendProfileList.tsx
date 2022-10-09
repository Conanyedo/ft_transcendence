import classes from "../../../styles/FriendList.module.css";
import Image from "next/image";

import Search from "../../../public/SearchIcon.svg";
import ListFriends from "./ListFriends";
import PendingList from "./PendingList";
import { FormEvent, useEffect, useRef, useState } from "react";
import BlockList from "./BlockList";
import { motion } from "framer-motion";
import { useOutsideAlerter } from "../../../customHooks/Functions";

const SearchFriend: React.FC<{
	ref_input: any;
	searchHandler: () => void;
	value: string;
}> = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	const ref_form = useRef(null);
	const SearchHandler = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		props.searchHandler();
	};
	const ClickHandler = () => {
		setIsOpen((value) => !value)
		
		props.ref_input?.current?.focus();
	};
	useOutsideAlerter(ref_form, setIsOpen);
	return (
		<form
			ref={ref_form}
			onSubmit={SearchHandler}
			className={`${classes.searchCtn} ${
				!isOpen ? classes.resizeCtnSearch : ""
			}`}
		>
			<div className={classes.btnSearch} onClick={ClickHandler}>
				<Image src={Search} />
			</div>
			<input
				value={props.value}
				type="text"
				className={`${!isOpen ? classes.hideSearch : classes.search}`}
				ref={props.ref_input}
				onChange={props.searchHandler}
				autoFocus={true}
			/>
		</form>
	);
};

const FriendProfileList = () => {
	const [indexCtn, setIndexCtn] = useState(0);
	const [inputValue, setInputValue] = useState("");
	const ref_input = useRef(null);

	const clearValue = () => {
		setInputValue("");
	};
	const FirendListHandler = () => {
		clearValue();
		setIndexCtn(0);
	};
	const PendingListHandler = () => {
		clearValue();
		setIndexCtn(1);
	};
	const BlockedListHandler = () => {
		clearValue();
		setIndexCtn(2);
	};
	const searchHandler = () => {
		setInputValue(ref_input.current!["value"]);
	};
	return (
		<div className={classes.FriendCtn}>
			<div className={classes.friends}>
				<div className={classes.friendHeader}>
					<div className={classes.btnCtn}>
						<div
							onClick={FirendListHandler}
							className={`${classes.btnFriend} ${
								indexCtn === 0 ? classes.btnSelected : ""
							}`}
						>
							Friend List
						</div>
						<div
							onClick={PendingListHandler}
							className={`${classes.btnFriend} ${
								indexCtn === 1 ? classes.btnSelected : ""
							}`}
						>
							Pending
						</div>
						<div
							onClick={BlockedListHandler}
							className={`${classes.btnFriend} ${
								indexCtn === 2 ? classes.btnSelected : ""
							}`}
						>
							Blocked Users
						</div>
					</div>
					<SearchFriend
						ref_input={ref_input}
						searchHandler={searchHandler}
						value={inputValue}
					/>
				</div>
				<motion.div
					key={indexCtn ? indexCtn : "empty"}
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -10, opacity: 0 }}
					transition={{ duration: 0.5 }}
				>
					{(indexCtn === 0 && <ListFriends search={inputValue} />) ||
						(indexCtn === 1 && (
							<PendingList search={inputValue} />
						)) ||
						(indexCtn === 2 && <BlockList search={inputValue} />)}
				</motion.div>
			</div>
		</div>
	);
};

export default FriendProfileList;
