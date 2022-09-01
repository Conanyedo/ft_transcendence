import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import classes from "../../styles/Loading.module.css";
import LoadingElm from "./Loading_elm";

const Loading = () => {
	const router = useRouter();
	const [click, setClick] = useState(false);
	useEffect(() => {
		const HandleStart = (url: string) =>
			url !== router.asPath && setClick(true);
		const HandleComplet = (url: string) => {
			if (url === router.asPath) {
				setClick(false);
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

	return ((click && (<LoadingElm />)) || <></>);
};

export default Loading;
