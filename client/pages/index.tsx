import { useRouter } from "next/router";
import classes from '../styles/homePage.module.css'
import { useRef } from "react";
import { motion } from "framer-motion";
import { useFollowPointer } from "../components/use-follow-pointer";

const HomePage = () => {
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
