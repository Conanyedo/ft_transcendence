import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import "@styles/globals.css"
import Skeleton from "../components/skeleton";
import { store } from "../store/store";
import { Provider } from "react-redux";
import { ChatProvider } from "@contexts/chatContext";
import Head from "next/head";
// import { ProvideAuth } from "../customHooks/useAuth";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<AnimatePresence exitBeforeEnter>

			<Provider store={store}><ChatProvider>

				{typeof window === "undefined" ? null : (
					<>
						<Head>
							<title>PingPong</title>
						</Head>
						<Component {...pageProps} />
					</>
				)}
			</ChatProvider>
			</Provider>

		</AnimatePresence>
	);
}

export default MyApp;
