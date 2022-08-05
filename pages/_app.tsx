import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import "../styles/globals.css";
import Skeleton from "../components/skeleton";

let i = 0;

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<AnimatePresence exitBeforeEnter>
			{typeof window === "undefined" ? null : (
				<Skeleton elm={<Component {...pageProps} />} />
			)}
		</AnimatePresence>
	);
}
export default MyApp;
