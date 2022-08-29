import classes from "../../styles/setting.module.css";
import Image from "next/image";
import CrossIcon from "../../public/FriendIcons/Cross.svg";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { HideSettings, Settings } from "../store/UI-Slice";
import { getCookie } from "cookies-next";
import axios from "axios";
import MsgSlideUp from "../slideUpMsg";

import OtpInput from "react-otp-input";
import Grid from "@material-ui/core/Grid";

const checkCode = async (code: string) => {
	const token = getCookie("jwt");
	const params = new URLSearchParams();
	params.append("code", code);
	try {
		await axios({
			method: "post",
			url: `http://localhost:5000/auth/2faValidate`,
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

const getCode = async () => {
	const token = getCookie("jwt");
	const params = new URLSearchParams();
	params.append("is2faEnabled", "true");
	try {
		const result = await axios({
			method: "post",
			url: `http://localhost:5000/auth/2faEnabling`,
			data: params,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		});
		return result.data;
	} catch (err) {
		return "#";
	}
};

const variants = {
	open: { scale: 1 },
	closed: { scale: 0 },
	hide: { opacity: 0, scale: 0 },
};
const spring = {
	type: "spring",
	stiffness: 700,
	damping: 30,
};

const disablehandler = async (status: string) => {
	const token = getCookie("jwt");
	const params = new URLSearchParams();
	params.append("is2faEnabled", status);
	try {
		const result = await axios({
			method: "post",
			url: `http://localhost:5000/auth/2faEnabling`,
			data: params,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		});
		return result.data;
	} catch {
	}
};

const isEnabledhandler = (set: any, setP: any) => {
	let res = false;
	const check = async () => {
		const token = getCookie("jwt");
		try {
			const result = await axios.get(
				`http://localhost:5000/auth/is2faEnabled`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
					withCredentials: true,
				}
			);
			set(result.data);
			setP(result.data);
		} catch {
		}
	};
	check();
	return res;
};

const FirstPage: React.FC<{ isOn: boolean; toggleSwitch: () => void }> = (
	props
) => {
	return (
		<>
			<div className={classes.SwitchContainer}>
				<span className={classes.title}>2 Factor Authentication</span>
				<div
					className={classes.switch}
					data-ison={props.isOn}
					onClick={props.toggleSwitch}
				>
					<motion.div
						className={classes.handle}
						layout
						transition={spring}
					/>
				</div>
			</div>
		</>
	);
};

const SecondPage: React.FC<{ QRcode: string, inputValue:string, codeFailed:boolean, setIsOn: any, setInputValue: any }> = (
	props
) => {
	return (
		<>
			<img src={props.QRcode} />
			<span>Please entre the OTP</span>
			<Grid >
				<OtpInput
					value={props.inputValue}
					numInputs={6}
					inputStyle={{
						width: "3rem",
						height: "3rem",
						margin: "0 .5rem",
						fontSize: "1.5rem",
						borderRadius: 4,
						border: `1px solid ${props.codeFailed ? "red" : "black"}`,
					}}
					onChange={(e: any) => {
						props.setIsOn(e.length === 6);
						props.setInputValue(e);
					}}
					shouldAutoFocus={true}
					isInputNum={true}
				/>
			</Grid>
		</>
	);
};

const Setting: React.FC = () => {
	const dispatch = useDispatch();
	const displayCard = useSelector(Settings);
	const [isValid, setIsValid] = useState(false);
	const [change, setchange] = useState(false);
	const [codeFailed, setcodeFailed] = useState(false);
	const [prevstat, setprevstat] = useState(false);
	const [isOn, setIsOn] = useState(false);
	const [QRcode, setQRcode] = useState("#");
	useEffect(() => {
		isEnabledhandler(setprevstat, setIsOn);
	}, []);
	const toggleSwitch = () => {
		setIsOn(!isOn);
		setchange(true);
	};
	const toggleHandler = async () => {
		if (QRcode === "#") {
			const qrCode: string = await disablehandler('true');
			setQRcode(qrCode);
		} else if (QRcode !== "#" && inputValue.length === 6) {
			const res: boolean = await checkCode(inputValue);
			setIsValid(res);
			setcodeFailed(!res);
			if (res) {
				setTimeout(() => {
					dispatch(HideSettings());
					setIsValid(false);
					setcodeFailed(false);
				}, 3000);
			}
		}
	};
	const [inputValue, setInputValue] = useState("");
	const handlerDisable = async () => {
		await disablehandler('false');
		setIsValid(true);
		setTimeout(() => {
			dispatch(HideSettings());
			setIsValid(false);
			setcodeFailed(false);
		}, 3000);
	};

	return (
		<>
			{isValid && (
				<MsgSlideUp msg="Done" colorCtn="#31BAAE" colorMsg="#ECF5FF" />
			)}
			{!isValid && displayCard && (
				<div className={classes.background}>
					<div className={classes.settingContainer}>
						<div className={classes.header}>
							<span>Settings</span>
							<div
								className={classes.cross}
								onClick={() => {
									setIsValid(false);
									setIsOn(false);
									dispatch(HideSettings());
								}}
							>
								<Image src={CrossIcon} width="72" height="72" />
							</div>
						</div>
						<div className={classes.pages}>
							{QRcode === "#" && (
								<FirstPage
									isOn={isOn}
									toggleSwitch={toggleSwitch}
								/>
							)}
							<motion.div
								defaultValue={"closed"}
								animate={
									QRcode !== "#"
										? "open"
										: QRcode === "#"
										? "hide"
										: "closed"
								}
								variants={variants}
								className={classes.qrCodeContainer}
							>
								{QRcode !== "#" && (
									<SecondPage QRcode={QRcode} inputValue={inputValue} setIsOn={setIsOn} setInputValue={setInputValue} codeFailed={codeFailed} />
								)}
							</motion.div>
						</div>
						<div
							className={`${classes.btn} ${
								prevstat !== isOn ? classes.btnNext : ""
							}`}
							onClick={
								(QRcode === "#" && !isOn && handlerDisable) ||
								toggleHandler
							}
						>
							{change && prevstat !== isOn && isOn
								? QRcode === "#"
									? "Next"
									: "Save"
								: "Confirm"}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Setting;
