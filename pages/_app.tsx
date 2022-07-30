import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<AnimatePresence exitBeforeEnter>
			{/* <div suppressHydrationWarning className="container"> */}
				{typeof window === "undefined" ? null : (
					<Component {...pageProps} />
				)}
			{/* </div> */}
		</AnimatePresence>
	);
}
export default MyApp;
