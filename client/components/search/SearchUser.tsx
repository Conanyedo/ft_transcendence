import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import classes from "../../styles/Search.module.css";
import { useOutsideAlerter } from "../../customHooks/Functions";
import profile from "../../public/profileImage.png";
import Option from "../../public/FriendIcons/OptionIcon.svg";
import { ADDButton, FriendButton, OptionMenu, PendingButton } from "../buttons";
import { EmtyUser, UserTypeNew } from "../../Types/dataTypes";
import { useRouter } from "next/router";
import { fetchDATA, requests } from "../../customHooks/useFetchData";

class types extends UserTypeNew{
	refresh: any;
}

const User: React.FC<types> = (props) => {
	const router = useRouter();
	const [option, setOption] = useState(false);
	const TaggleHandler = () => setOption(!option);
	const goToChat = () => router.push('/chat/' + props.login);
	const wrapperRef = useRef(null);
	const BlockHandler = async () => {
		await requests(props.login, "friendship/blockUser", router);
		props.refresh();
	}
	useOutsideAlerter(wrapperRef, setOption);
	return (
		<div className={classes.friend}>
			<div className={classes.Avatar_name}>
				<div className={classes.avatar}>
					<Image src={props.avatar} />
				</div>
				<div className={classes.friendName}>{props.fullname}</div>
			</div>
			<div className={classes.optionFriend}>
				{props.relation === "notFriend" && <ADDButton login={props.login} router={router} refresh={props.refresh} />}
				{props.relation === "pending" && <PendingButton login={props.login} router={router} refresh={props.refresh}  />}
				{props.relation === "friend" && <FriendButton  login={props.login} router={router} refresh={props.refresh} />}
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

const SearchUserList: React.FC = () => {
	const router = useRouter();
	const [searchData, setSearchData] = useState<UserTypeNew[]>([]);
	const refresh = () => {}
	useEffect(() => {
		// fetchDATA(setSearchData, router, '');
		return () => {
			setSearchData([]);
		}
	}, [])
	return (
		<>
			<motion.div className={classes.SearchCTNIN}>
				{searchData && searchData?.map((user) => <User {...user} refresh={refresh} />)}
			</motion.div>
		</>
	);
};

export default SearchUserList;
