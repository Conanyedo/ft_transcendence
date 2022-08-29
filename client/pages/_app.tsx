import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import "../styles/globals.css";
import Skeleton from "../components/skeleton";
import { store } from "../components/store/store";
import { Provider } from "react-redux";
import Head from "next/head";
// import { ProvideAuth } from "../customHooks/useAuth";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<AnimatePresence exitBeforeEnter>
			<Provider store={store}>
				{typeof window === "undefined" ? null : (
					<>
						<Head>
							<title>PingPong</title>
						</Head>
						<Skeleton elm={<Component {...pageProps} />} />
					</>
				)}
			</Provider>
		</AnimatePresence>
	);
}
export default MyApp;
