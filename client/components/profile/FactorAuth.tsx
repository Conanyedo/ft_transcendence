import classes from "../../styles/factorAuth.module.css";
import CrossIcon from "../../public/FriendIcons/Cross.svg";
import Image from "next/image";
import OtpInput from "react-otp-input";
import { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { CookieValueTypes, getCookie } from "cookies-next";
import axios from "axios";
import { NextRouter, useRouter } from "next/router";
import { baseUrl } from "../../config/baseURL";
import LoadingElm from "../loading/Loading_elm";

const checkCode = async (code: string, router: NextRouter) => {
	const token = getCookie("jwt");
	const params = new URLSearchParams();
	params.append("code", code);
	return await axios({
			method: "post",
			url: `${baseUrl}auth/2faLogin`,
			data: params,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		}).then((res) => {
			return true;
		}).catch((err) => {
			if (err.response.data.message !== 'Wrong authentication code')
				router.replace('/');
			return false;
		})
};

const check2FA_JWT = async (jwt: CookieValueTypes, set: any, router: NextRouter) => {
	await axios({
		method: "get",
		url: `${baseUrl}auth/is2fa`,
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		withCredentials: true,
	}).then(() => {
		set(true);
	}).catch(() => router.replace('/'));
}


const FactorAuth = () => {
	const router = useRouter();
	const [isValid, setisValid] = useState(false);
	const jwt = getCookie('jwt-2fa');
	if (!jwt)
		router.push('/');
	const [inputValue, setInputValue] = useState("");
	const [isError, setisError] = useState(false);
	useEffect(() => {
		check2FA_JWT(jwt, setisValid, router);
	}, []);
	if (isValid) return <LoadingElm />;
	const CheckHandler = async () => {
		if (await checkCode(inputValue, router))
			router.push('/profile');
		else
			setisError(true);
	}
	return (
		<>
			<div className={classes.background}>
				<div className={classes.FAuthContainer}>
					<div className={classes.header}>
						<span>2 Factor Authentication</span>
						<div className={classes.cross} onClick={()=> router.replace('/profile')}>
							<Image src={CrossIcon} width="72" height="72" />
						</div>
					</div>
					<div className={classes.inputContainer}>
						<Grid>
							<OtpInput
								value={inputValue}
								numInputs={6}
								inputStyle={{
									width: "3rem",
									height: "3rem",
									margin: "0 .5rem",
									fontSize: "1.5rem",
									borderRadius: 4,
									border: `1px solid ${
										isError ? "red" : "black"
									}`,
								}}
								onChange={(e: any) => {
									setInputValue(e);
								}}
								shouldAutoFocus={true}
								isInputNum={true}
							/>
						</Grid>
					</div>
					<div
						className={`${classes.btn} ${
							inputValue.length === 6 ? classes.btnNext : ""
						}`} onClick={CheckHandler}
					>
						Confirmer
					</div>
				</div>
			</div>
		</>
	);
};

export default FactorAuth;
