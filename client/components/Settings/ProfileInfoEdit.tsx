import classes from "../../styles/EditProfile.module.css";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import UploadIcon from "../../public/FriendIcons/UploadIcon.svg";
import CrossIcon from "../../public/FriendIcons/Cross.svg";
import { useAppDispatch } from "../store/hooks";
import { Toggle } from "../store/UI-Slice";
import axios from "axios";
import { UserType } from "../../Types/dataTypes";
import { initialState as emtyUser } from "../store/userSlice";
import { motion } from "framer-motion";

interface profileData {
	setTagle: (t: boolean) => void;
}

export function useOutsideAlerter(ref: any, setToggle: (t: boolean) => void) {
	useEffect(() => {
		function handleClickOutside(event: any) {
			if (ref.current && !ref.current.contains(event.target)) {
				setToggle(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);
}

export function useInSideAlerter(
	ref: any,
	setToggle: (t: boolean) => void,
	move: () => void
) {
	useEffect(() => {
		function handleClickOutside(event: any) {
			if (ref.current && ref.current.contains(event.target)) {
				move();
				setToggle(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref]);
}

const ProfileInfoEdit: React.FC<profileData> = (props) => {
	// const [nameClass , setNameClass] = useState('');
	const nameRef = useRef(null);
	const dispatch = useAppDispatch();
	const [UserData, setUserData] = useState<UserType>(emtyUser);
	const toggleHandler = () => {
		// const value: any = nameRef.current;
		// dispatch(changeName(value.value));
		dispatch(Toggle());
		// console.log();
	};

	useEffect(() => {
		const fetchData = async () => {
			const data = await axios
				.get(
					`https://test-76ddc-default-rtdb.firebaseio.com/owner.json`
				)
				.then((res) => {
					setUserData(res.data);
					// console.log(res.data);
				});
		};
		if (UserData?.fullName === "") fetchData();
	}, []);

	// upload AVATAR TODO

	const wrapperRef = useRef(null);
	useOutsideAlerter(wrapperRef, props.setTagle);
	const clickHandler = () => {
		props.setTagle(false);
	};
	return (
		<motion.div
			className={classes.background}
			initial={{
				opacity: 0,
			}}
			animate={{
				opacity: 1,
			}}
		>
			<motion.div
				className={classes.popUpCtn}
				ref={wrapperRef}
				initial={{
					opacity: 0,
					scale: 0.1,
				}}
				animate={{
					opacity: 1,
					scale: 1,
				}}
			>
				<div className={classes.titlePopUp}>
					Edit Profile
					<motion.div
						onClick={clickHandler}
						className={classes.cross}
						animate="animate"
					>
						<Image src={CrossIcon} width="120%" height="120%" />
					</motion.div>
				</div>
				<div className={classes.avatar}>
					<img src={UserData.avatar} />
					<div className={`${classes.toggle}`}>
						<Image src={UploadIcon} width="120%" height="120%" />
					</div>
				</div>
				<div className={classes.UserName}>Username :</div>
				<input
					className={classes.UserNameInput}
					type="text"
					defaultValue={UserData.fullName}
					ref={nameRef}
				/>
				<div className={classes.btnSave} onClick={toggleHandler}>
					Update
				</div>
			</motion.div>
		</motion.div>
	);
};

export default ProfileInfoEdit;
