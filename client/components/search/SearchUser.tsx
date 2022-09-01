import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import classes from "../../styles/Search.module.css";
import { useOutsideAlerter } from "../Settings/ProfileInfoEdit";
import {
	ADDButton,
	FriendButton,
	OptionMenu,
	PendingButton,
} from "../../pages/search";
import profile from "../../public/profileImage.png";
import Option from "../../public/FriendIcons/OptionIcon.svg";

interface friendDataType {
	Avatar: any;
	fullName: string;
	stat: string;
}

const User: React.FC<friendDataType> = (props) => {
	const [option, setOption] = useState(false);
	const TaggleHandler = () => setOption(!option);
	const [classBtn, setClassBtn] = useState(classes.friendvalue);
	const [classeBtnAfter, setClasseBtnAfter] = useState(classes.afterFriend);
	useEffect(() => {
		if (props.stat === "pending") setClassBtn(classes.pendingvalue);
		if (props.stat === "notFriend") setClassBtn(classes.notFriendvalue);
	}, [classBtn]);
	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef, setOption);
	return (
		<div className={classes.friend}>
			<div className={classes.Avatar_name}>
				<div className={classes.avatar}>
					<Image src={props.Avatar} />
				</div>
				<div className={classes.friendName}>{props.fullName}</div>
			</div>
			<div className={classes.optionFriend}>
				{props.stat === "notFriend" && <ADDButton />}
				{props.stat === "pending" && <PendingButton />}
				{props.stat === "friend" && <FriendButton />}
				<div
					className={classes.optionsbtnctn}
					onClick={TaggleHandler}
					ref={wrapperRef}
				>
					<Image src={Option} />
					{option && (
						<OptionMenu
							FirstBtn="Direct message"
							SecondBtn="Block user"
							width="9rem"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

const SearchUserList: React.FC = () => {
	return (
		<>
			<motion.div className={classes.SearchCTNIN}>
				<User fullName="Ayoub boulbaz" Avatar={profile} stat="friend" />
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="pending"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User fullName="Ayoub boulbaz" Avatar={profile} stat="friend" />
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="pending"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User fullName="Ayoub boulbaz" Avatar={profile} stat="friend" />
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="pending"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User fullName="Ayoub boulbaz" Avatar={profile} stat="friend" />
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="pending"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User fullName="Ayoub boulbaz" Avatar={profile} stat="friend" />
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="pending"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User fullName="Ayoub boulbaz" Avatar={profile} stat="friend" />
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="pending"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User fullName="Ayoub boulbaz" Avatar={profile} stat="friend" />
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="pending"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
				<User
					fullName="Ayoub boulbaz"
					Avatar={profile}
					stat="notFriend"
				/>
			</motion.div>
		</>
	);
};

export default SearchUserList;
