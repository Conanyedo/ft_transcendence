import {  useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isAuthorized } from "../../customHooks/useFetchData";
import LoadingElm from "../loading/Loading_elm";

type PropsType = {
	children: JSX.Element;
};

const LoginWrapper: React.FC<PropsType> = ({ children }) => {
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);
	const [IsAuth, setIsAuth] = useState(0);

	useEffect(() => {
		setIsMounted(true);
		isAuthorized(router, setIsAuth);
	}, []);

	useEffect(() => {
		if (IsAuth === 1 && isMounted) 
			router.push('/profile');
	}, [IsAuth])
	if (IsAuth === 2) return <LoadingElm />;

	return <>{isMounted && children}</>;
};

export default LoginWrapper;
