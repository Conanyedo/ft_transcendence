import { useEffect, useState } from "react";
import classes from "../../styles/Loading.module.css";

const LoadingElm = () => {
	const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
		setIsMounted(true);
	}, []);
	if (!isMounted) return <></>
	return (
		<div className={classes.dark}>
			<div className={classes["pong-loader"]} />
		</div>
	);
};

export default LoadingElm;
