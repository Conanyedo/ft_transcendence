import classes from "../../styles/factorAuth.module.css";
import CrossIcon from "../../public/FriendIcons/Cross.svg";
import Image from "next/image";
import OtpInput from "react-otp-input";
import { useState } from "react";
import { Grid } from "@material-ui/core";
import { getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";

const checkCode = async (code: string) => {
	const token = getCookie("jwt");
	const params = new URLSearchParams();
	params.append("code", code);
	try {
		await axios({
			method: "post",
			url: `http://localhost:5000/auth/2faLogin`,
			data: params,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		});
		return true;
	} catch (err) {
		return false;
	}
};


const FactorAuth = () => {
			console.log('hna');
	const router = useRouter();
	const [inputValue, setInputValue] = useState("");
	const [isError, setisError] = useState(false);
	const CheckHandler = async () => {
		if (await checkCode(inputValue)){
			
			router.push('/profile');}
		else
			setisError(true)
	}
	return (
		<>
			<div className={classes.background}>
				<div className={classes.FAuthContainer}>
					<div className={classes.header}>
						<span>2 Factor Authentication</span>
						<div className={classes.cross}>
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
