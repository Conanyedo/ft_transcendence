import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import "../styles/globals.css";
import { store } from "@store/store";
import { Provider } from "react-redux";
import { ChatProvider } from "@contexts/chatContext";
import Head from "next/head";
import { useRouter } from "next/router";
import ContentWrapper from "../components/wrapper/appWrapper";
import ico from '../public/favicon.ico'

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const path = router.asPath;

	if (path === '/' || path.includes('game/') && !path.includes('game/lobby') || path.includes('?_2fa=true')) {
		return <AnimatePresence exitBeforeEnter>
			{typeof window === "undefined" ? null : (
				<>
					<Head>
						<title>PongMania</title>
						<link rel="shortcut icon" href={ico.src} />
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
						<title>PongMania</title>
						<link rel="shortcut icon" href={ico.src} />
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
