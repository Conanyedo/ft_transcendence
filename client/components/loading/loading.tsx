import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import classes from "../../../styles/Loading.module.css";

const Loading = () => {
	const router = useRouter();
	const [click, setClick] = useState(false);
	useEffect(() => {
		const HandleStart = (url: string) =>
			url !== router.asPath && setClick(true);
		const HandleComplet = (url: string) => {
            console.log(url);
            
			if (url === router.asPath) {
				setClick(false);
				console.log("mdkhalch hna");
			}
		};

		router.events.on("routeChangeStart", HandleStart);
		router.events.on("routeChangeComplete", HandleComplet);
		router.events.on("routeChangeError", HandleComplet);

		return () => {
			router.events.off("routeChangeStart", HandleStart);
			router.events.off("routeChangeComplete", HandleComplet);
			router.events.off("routeChangeError", HandleComplet);
		};
	}, []);

	return (
		(click && (
			<div className={classes.dark}>
				<div className={classes["pong-loader"]} />
			</div>
		)) || <></>
	);
};

export default Loading;
