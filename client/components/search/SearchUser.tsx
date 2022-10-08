import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import classes from "../../styles/Search.module.css";
import { getImageBySize, useOutsideAlerter } from "../../customHooks/Functions";
import Option from "../../public/FriendIcons/OptionIcon.svg";
import {
	ADDButton,
	FriendButton,
	OptionMenu,
	PendingButton,
	RequestButton,
} from "../buttons";
import { UserTypeNew } from "../../Types/dataTypes";
import { useRouter } from "next/router";
import { fetchDATA, requests } from "../../customHooks/useFetchData";

class types extends UserTypeNew {
	refresh: any;
}

const User: React.FC<types> = (props) => {
	const router = useRouter();
	const [option, setOption] = useState(false);
	const TaggleHandler = () => setOption(!option);
	const goToChat = () => router.push("/chat?login=" + props.login);
	const wrapperRef = useRef(null);
	const BlockHandler = async () => {
		await requests(props.login, "friendship/blockUser", router);
		props.refresh();
	};
	useOutsideAlerter(wrapperRef, setOption);
	const pathImage = getImageBySize(props.avatar, 70);
	return (
		<div className={classes.friend}>
			<div className={classes.Avatar_name}>
				<div className={classes.avatar}>
					<img src={pathImage} />
				</div>
				<div className={classes.friendName}>{props.fullname}</div>
			</div>
			<div className={classes.optionFriend}>
				{props.relation === "none" && (
					<ADDButton
						login={props.login}
						router={router}
						refresh={props.refresh}
					/>
				)}
				{props.relation === "pending" && (
					<PendingButton
						login={props.login}
						router={router}
						refresh={props.refresh}
					/>
				)}
				{props.relation === "friend" && (
					<FriendButton
						login={props.login}
						router={router}
						refresh={props.refresh}
					/>
				)}
				{props.relation === "requested" && (
					<RequestButton
						login={props.login}
						router={router}
						refresh={props.refresh}
					/>
				)}
				<div
					className={classes.optionsbtnctn}
					onClick={TaggleHandler}
					ref={wrapperRef}
				>
					<Image src={Option} />
					{option && (
						<OptionMenu
							FirstBtn="Direct message"
							firstClick={goToChat}
							SecondBtn="Block user"
							SecondClick={BlockHandler}
							width="9rem"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

const SearchUserList: React.FC<{ value: string }> = (props) => {
	const router = useRouter();
	const [searchData, setSearchData] = useState<UserTypeNew[]>([]);
	const refresh = () =>
		fetchDATA(setSearchData, router, `search/users/?search=${props.value}`);
	useEffect(() => {
		if (props.value && ((/^(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/g).test(props.value)))
			fetchDATA(
				setSearchData,
				router,
				`search/users/?search=${props.value}`
			);
		return () => {
			setSearchData([]);
		};
	}, [props.value]);
	return (
		<>
			<motion.div className={classes.SearchCTNIN}>
				{searchData &&
					searchData?.map((user) => {
						if (user)
							return (
								<User
									{...user}
									refresh={refresh}
									key={user.login}
								/>
							);
					})}
				{!searchData.length && (
					<div className={classes.userNotFound}>
						couldn't find anyone with '{props.value}'
					</div>
				)}
			</motion.div>
		</>
	);
};

export default SearchUserList;
