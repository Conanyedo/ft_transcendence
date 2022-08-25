import { useRouter } from "next/router";
import classes from "../styles/homePage.module.css";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useFollowPointer } from "../components/use-follow-pointer";

const HomePage = () => {
	const router = useRouter();
	// const fetchData = async () => {
	// 	await fetch(`http://10.13.8.14:3000/login`,)
	// 		.then((res) => {
	// 			console.log(res);
	// 			router.push("/profile");
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };
	const ref = useRef(null);
	const { x, y } = useFollowPointer(ref);
	return (
		<div className={classes.screensize}>
			<motion.a
				whileHover={{ scale: 1.5 }}
				whileTap={{ scale: 0.9 }}
				className={classes.loginBtn}
				// onClick={fetchData}
				href='http://10.13.10.6:3000/auth/login'
			>
				Login
			</motion.a>
		</div>
	);
};

export default HomePage;
