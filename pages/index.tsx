import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setFriend } from "../components/store/FriendsSlice";
import { useAppDispatch, useAppSelector } from "../components/store/hooks";
import { RootState } from "../components/store/store";
import {
	selectUser,
	setUser,
	initialState as userInit,
} from "../components/store/userSlice";

// import "./styles.css";
import classes from '../styles/homePage.module.css'
import { useRef } from "react";
import { motion } from "framer-motion";
import { useFollowPointer } from "../components/use-follow-pointer";
// import { useFollowPointer } from "./use-follow-pointer";

const HomePage = () => {
	// const [sala, setsala] = useState(0);
	// const router = useRouter();
	// const dispatch = useAppDispatch();
	// const user = useAppSelector(selectUser);

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		const data = await axios
	// 			.get(
	// 				"https://test-76ddc-default-rtdb.firebaseio.com/owner.json"
	// 			)
	// 			.then((res) => {
	// 				dispatch(setUser(res.data));
	// 				setsala(1);
	// 			});
	// 	};
	// 	const fetchusers = async () => {
	// 		const data = await axios
	// 			.get("https://test-76ddc-default-rtdb.firebaseio.com/all.json")
	// 			.then((res) => {
	// 				const entries = Object.entries(res.data);
	// 				entries.map((user) => {
	// 					dispatch(setUsers(user[1]));
	// 				});
	// 			})
	// 			.catch((err) => {
	// 				console.log(err);
	// 			});
	// 	};
	// 	const frinds = async () => {
	// 		await axios
	// 			.get(
	// 				`https://test-76ddc-default-rtdb.firebaseio.com/friend.json`
	// 			)
	// 			.then((res) => {
	// 				const entries = Object.entries(res.data);
	// 				entries.map((user) => {
	// 					dispatch(setFriend(user[1]));
	// 				});
	// 			});
	// 	};
	// 	frinds();
	// 	fetchData();
	// 	fetchusers();
	// }, []);
	// if (sala === 1) {
	// 	localStorage.setItem("owner", user.id.toString());
	// 	router.push("/profile");
	// }
	const router = useRouter();
	const LoginHandler = () => {
		router.push("/profile");
	}
	const ref = useRef(null);
	const { x, y } = useFollowPointer(ref);
	return (
		<>
		<motion.div
			ref={ref}
			className={classes.box}
			animate={{ x, y }}
			transition={{
				type: "spring",
				damping: 3,
				stiffness: 50,
				restDelta: 0.001,
			}}
		/>
		<motion.div className={classes.loginBtn} onClick={LoginHandler}>
			Login
		</motion.div>
		</>
	);
};

export default HomePage;
