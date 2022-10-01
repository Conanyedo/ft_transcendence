import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import "../styles/globals.css";
import { store } from "@store/store";
import { Provider } from "react-redux";
import { ChatProvider } from "@contexts/chatContext";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import ContentWrapper from "../components/wrapper/appWrapper";

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const path = router.asPath;

	if (path === '/' || path.includes('game/') && !path.includes('game/lobby') || path.includes('?_2fa=true')) {
		return <AnimatePresence exitBeforeEnter>
			{typeof window === "undefined" ? null : (
				<>
					<Head>
						<title>Login</title>
					</Head>
					<Component {...pageProps} />
				</>
			)}
	</AnimatePresence>
	}

	return (
		<AnimatePresence exitBeforeEnter>

			<Provider store={store}><ChatProvider>

				{typeof window === "undefined" ? null : (
					<>
						<Head>
							<title>PingPong</title>
						</Head>
						<ContentWrapper children={ <Component {...pageProps} />} />
					</>
				)}
			</ChatProvider>
			</Provider>

		</AnimatePresence>
	);
}

export default MyApp;
