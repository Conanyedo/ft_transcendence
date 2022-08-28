import classes from "../../styles/factorAuth.module.css";
import CrossIcon from "../../public/FriendIcons/Cross.svg";
import Image from "next/image";
import { OTP_Input } from "./settings";
import { useState } from "react";

const FactorAuth = () => {
	const [inputValue, setInputValue] = useState("");
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
						<OTP_Input
							inputValue={inputValue}
							setInputValue={setInputValue}
						/>
					</div>
					<div
						className={`${classes.btn} ${
							inputValue.length === 6 ? classes.btnNext : ""
						}`}
					>
						Confirmer
					</div>
				</div>
			</div>
		</>
	);
};

export default FactorAuth;
