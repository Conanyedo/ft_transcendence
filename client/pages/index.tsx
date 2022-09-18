import { useRouter } from "next/router";
import FactorAuth from "../components/profile/FactorAuth";
import { useEffect, useState } from "react";
import Login from "../components/LoginPage/Login";
import LoadingElm from "../components/loading/Loading_elm";
import LoginWrapper from "../components/wrapper/LoginWrapper";

const HomePage = () => {
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);
	const open = (router.asPath === '/');
	
	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return <LoadingElm />;

	return (
		<LoginWrapper children={open && <Login /> || <FactorAuth />}/>
	);
};

export default HomePage;
