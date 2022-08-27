import { useRouter } from "next/router";
import classes from "../styles/homePage.module.css";
import { motion } from "framer-motion";
import Loading from "../components/loading/loading";
import useFetchData from "../customHooks/useFetchData";

const HomePage = () => {
	const router = useRouter();
	const data = useFetchData("auth/isAuthorized");
	return (
		<>
			<div className={classes.screensize}>
				{/* <div className={classes.boss}>
					<ul className={classes.login}>
						<li>
							<span>Login </span>
						</li>
					</ul>
				</div> */}
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
