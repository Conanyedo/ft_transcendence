import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import "../styles/globals.css";
import Skeleton from "../components/skeleton";
import { store } from "../components/store/store";
import { Provider } from "react-redux";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	if (router.pathname === "/")
		return (
			<AnimatePresence exitBeforeEnter>
				{typeof window === "undefined" ? null : (
					<Component {...pageProps} />
				)}
			</AnimatePresence>
		);
	return (
		<AnimatePresence exitBeforeEnter>
			<Provider store={store}>
				{typeof window === "undefined" ? null : (
					<Skeleton elm={<Component {...pageProps} />} />
				)}
			</Provider>
		</AnimatePresence>
	);
}
export default MyApp;
