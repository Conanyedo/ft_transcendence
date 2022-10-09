import { getCookie } from "cookies-next";
import {  useRouter } from "next/router";
import { useEffect, useState } from "react";
import { checkJWT } from "../../customHooks/useFetchData";
import LoadingElm from "../loading/Loading_elm";

type PropsType = {
	children: JSX.Element;
};

const LoginWrapper: React.FC<PropsType> = ({ children }) => {
	const router = useRouter();
	const jwt = getCookie("jwt");
	const jwt_2fa = getCookie("jwt-2fa");
	const [isMounted, setIsMounted] = useState(false);
	const [IsAuth, setIsAuth] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		if (jwt) checkJWT(router, setIsAuth);
	}, []);

	useEffect(() => {
		if (IsAuth && isMounted) 
				router.push('/profile');
	}, [IsAuth])
	if (jwt) return <LoadingElm />;
	else if (jwt_2fa && router.asPath === "/") {
		router.push("/?_2fa=true");
		return <LoadingElm />;
	}
	else if (IsAuth) return <LoadingElm />;

	return <>{isMounted && children}</>;
};

export default LoginWrapper;
