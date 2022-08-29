import { useRouter } from "next/router";
import classes from "../styles/homePage.module.css";
import { motion } from "framer-motion";
import Loading from "../components/loading/loading";
import useFetchData from "../customHooks/useFetchData";
import FactorAuth from "../components/profile/FactorAuth";

const HomePage = () => {
	const router = useRouter();
	const open = (router.query._2fa !== undefined);
	if (!open)
		useFetchData("auth/isAuthorized");
	return (
		<>
			{open && <FactorAuth />}
			<div className={classes.screensize}>
				<motion.a
					whileHover={{ scale: 1.5 }}
					whileTap={{ scale: 0.9 }}
					className={classes.loginBtn}
					onClick={(e) =>
						router.push("http://localhost:5000/auth/login")
					}
				>
					42 Intra
				</motion.a>
				<motion.a
					whileHover={{ scale: 1.5 }}
					whileTap={{ scale: 0.9 }}
					className={classes.loginBtn}
					onClick={(e) =>
						router.push("http://localhost:5000/auth/google/login")
					}
				>
					Google
				</motion.a>
			</div>
			<Loading />
		</>
	);
};

export default HomePage;
