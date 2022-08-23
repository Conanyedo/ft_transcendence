import classes from "../styles/Section.module.css";
import { motion } from "framer-motion";

const Section = (props: { elm: any }) => {
	return (
		<motion.div
			initial={{ y: 10, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			exit={{ y: -10, opacity: 0 }}
			transition={{ duration: 0.5 }}
			className={classes.containerSection}
		>
			{props.elm}
		</motion.div>
	);
};

export default Section;
