import { useRouter } from "next/router";
import classes from "../styles/homePage.module.css";
import { motion } from "framer-motion";
import Loading from "../components/loading/loading";
import useFetchData from "../customHooks/useFetchData";
import FactorAuth from "../components/profile/FactorAuth";

const HomePage = () => {
	const router = useRouter();
	const open = router.query._2fa !== undefined;
	if (!open) useFetchData("isAuthenticated");
	return (
		<>
			{open && <FactorAuth />}
			<motion.div className={classes.screensize}>
				<motion.div
					whileHover={{ scale: 1.2 }}
					whileTap={{ scale: 1.1 }}
					className={classes.loginBtn}
					onClick={(e) =>
						router.push("http://localhost:5000/auth/login")
					}
				>
					42 Intra
				</motion.div>
				<motion.div
					whileHover={{ scale: 1.2 }}
					whileTap={{ scale: 1.1 }}
					className={classes.loginBtn}
					onClick={(e) =>
						router.push("http://localhost:5000/auth/google/login")
					}
				>
					Google
				</motion.div>
			</motion.div>
			{!open && <Loading />}
		</>
	);
};

export default HomePage;
