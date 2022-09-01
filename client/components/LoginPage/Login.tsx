import { motion } from "framer-motion";
import classes from "../../styles/homePage.module.css";
import { useRouter } from "next/router";
import { baseUrl } from "../../config/baseURL";
import { useEffect, useState } from "react";
import LoadingElm from "../loading/Loading_elm";

const Login = () => {
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
		setIsMounted(true);
	}, []);
	if (!isMounted) return <LoadingElm />

	return (
		<>
			<motion.div className={classes.screensize}>
				<motion.div
					whileHover={{ scale: 1.2 }}
					whileTap={{ scale: 1.1 }}
					className={classes.loginBtn}
					onClick={(e) => router.push(`${baseUrl}auth/login`)}
				>
					42 Intra
				</motion.div>
				<motion.div
					whileHover={{ scale: 1.2 }}
					whileTap={{ scale: 1.1 }}
					className={classes.loginBtn}
					onClick={(e) => router.push(`${baseUrl}auth/google/login`)}
				>
					Google
				</motion.div>
			</motion.div>
		</>
	);
};

export default Login;
