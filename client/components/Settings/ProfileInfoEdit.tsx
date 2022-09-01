import classes from "../../styles/EditProfile.module.css";
import Image from "next/image";
import React, { LegacyRef, MutableRefObject, RefObject, useEffect, useRef, useState } from "react";
import UploadIcon from "../../public/FriendIcons/UploadIcon.svg";
import CrossIcon from "../../public/FriendIcons/Cross.svg";
import { useAppDispatch } from "../store/hooks";
import { Toggle } from "../store/UI-Slice";
import axios from "axios";
import { UserType, UserTypeNew } from "../../Types/dataTypes";
import { initialState as emtyUser } from "../store/userSlice";
import { motion } from "framer-motion";
import { baseUrl, eraseCookie } from "../../config/baseURL";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { userInfo } from "os";

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

let oldname: string = '';
let oldImage: string = '';

const ProfileInfoEdit: React.FC<profileData> = (props) => {
	// const [nameClass , setNameClass] = useState('');
	const nameRef = useRef<any>(null);
	const ImageRef = useRef<any>(null);
	const avatarRef = useRef<any>(null);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const token = getCookie("jwt");
	const params = new FormData();
	const [UserData, setUserData] = useState<UserTypeNew>(new UserTypeNew());
	const toggleHandler = async () => {
		const currentName = nameRef.current;
		const currentImage = ImageRef.current;
		const Name: string = currentName!.value;
		const Image = currentImage!.files;
		if (oldname !== Name)
			params.append("fullname", nameRef.current!.value);
		if (Image![0])
			params.append("avatar", Image![0]);
		if (oldImage.includes('https://cdn.intra.42.fr'))
			params.append("isDefault", 'true');
		await axios
			.post(`${baseUrl}user/editProfile`, params, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				withCredentials: true,
			})
			.catch((err) => console.log(err));
		dispatch(Toggle());
		router.reload();
	};

	useEffect(() => {
		const fetchData = async () => {
			await axios
				.get(`${baseUrl}user/header`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
					withCredentials: true,
				})
				.then((res) => {
					oldImage = res.data.avatar;
					oldname = res.data.fullname;
					setUserData(res.data);
				})
				.catch((err) => {
					eraseCookie("jwt");
					router.replace("/");
				});
		};
		const avatar = avatarRef.current;
		const Image = avatarRef.current;
		Image!.addEventListener('change', () => {
			avatar!.src = URL.createObjectURL(Image!.files![0]);
		})
		if (!UserData?.fullname) fetchData();
	}, []);

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
					<img src={UserData.avatar} ref={avatarRef} />
					<input
						type="file"
						className={`${classes.toggle} ${classes.inputHide}`}
						ref={ImageRef}
						accept='.png, .jpg, .jpeg'
					/>
					<div className={`${classes.toggle}`}>
						<Image src={UploadIcon} width="120%" height="120%" />
					</div>
				</div>
				<div className={classes.UserName}>Username :</div>
				<input
					className={classes.UserNameInput}
					type="text"
					defaultValue={UserData.fullname}
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
