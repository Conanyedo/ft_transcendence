import classes from "../../styles/setting.module.css";
import Image from "next/image";
import { useQRCode } from "next-qrcode";
import CrossIcon from "../../public/FriendIcons/Cross.svg";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { HideSettings, Settings } from "../store/UI-Slice";

export const OTP_Input: React.FC<{inputValue: string, setInputValue: any}> = (props) => {
	const ref_1 = useRef(null);
	const ref_2 = useRef(null);
	const ref_3 = useRef(null);
	const ref_4 = useRef(null);
	const ref_5 = useRef(null);
	const ref_6 = useRef(null);
	const refTable = [ref_1, ref_2, ref_3, ref_4, ref_5, ref_6];
	const changeHandler = (e: any) => {
		if (e.target.value.length === 0) {
			if (props.inputValue.length === 0) return;
			if (e.target.alt != 1)
				refTable[Number(e.target.alt - 2)].current!.focus();
				props.setInputValue((v:any) => v.substring(0, v.length - 1));
		} else {
			if (props.inputValue.length === 6) return;
			props.setInputValue((value:any) => value.concat(e.target.value));
			if (e.target.alt < 6) refTable[e.target.alt].current!.focus();
		}
	};
	return (
		<div className={classes.inputContainer}>
			<input
				alt="1"
				className={classes.input}
				maxLength={1}
				onChange={changeHandler}
				ref={ref_1}
			/>
			<input
				alt="2"
				className={classes.input}
				maxLength={1}
				onChange={changeHandler}
				ref={ref_2}
			/>
			<input
				alt="3"
				className={classes.input}
				maxLength={1}
				onChange={changeHandler}
				ref={ref_3}
			/>
			<input
				alt="4"
				className={classes.input}
				maxLength={1}
				onChange={changeHandler}
				ref={ref_4}
			/>
			<input
				alt="5"
				className={classes.input}
				maxLength={1}
				onChange={changeHandler}
				ref={ref_5}
			/>
			<input
				alt="6"
				className={classes.input}
				maxLength={1}
				onChange={changeHandler}
				ref={ref_6}
			/>
		</div>
	);
};

const Setting: React.FC = () => {
	const { Canvas } = useQRCode();
	const dispatch = useDispatch();
	const displayCard = useSelector(Settings);
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
	const [isOn, setIsOn] = useState(false);
	const [nextPage, setNextPage] = useState(true);
	const toggleSwitch = () => {
		setIsOn(!isOn);
	};
	const toggleHandler = () => {
		if (nextPage) setNextPage(false);
		if (!nextPage) {
			dispatch(HideSettings());
			setNextPage(true);
		}
		console.log(inputValue);
	};
	const [inputValue, setInputValue] = useState("");
	return (
		<>
			{displayCard && (
				<div className={classes.background}>
					<div className={classes.settingContainer}>
						<div className={classes.header}>
							<span>Settings</span>
							<div
								className={classes.cross}
								onClick={() => dispatch(HideSettings())}
							>
								<Image src={CrossIcon} width='72' height='72' />
							</div>
						</div>
						<div className={classes.pages}>
							{nextPage && (
								<div className={classes.SwitchContainer}>
									<span className={classes.title}>
										2 Factor Authentication
									</span>
									<div
										className={classes.switch}
										data-isOn={isOn}
										onClick={toggleSwitch}
									>
										<motion.div
											className={classes.handle}
											layout
											transition={spring}
										/>
									</div>
								</div>
							)}
							<motion.div
								defaultValue={"closed"}
								animate={
									!nextPage
										? "open"
										: nextPage
										? "hide"
										: "closed"
								}
								variants={variants}
								className={classes.qrCodeContainer}
							>
								{!nextPage && (
									<>
										<Canvas
											text={"#"}
											options={{
												type: "image/jpeg",
												quality: 0.3,
												level: "S",
												margin: 3,
												scale: 6,
												width: 0,
											}}
										/>
										<span>Plaise type the 6 Number</span>
										
										<OTP_Input inputValue={inputValue} setInputValue={setInputValue} />
									</>
								)}
							</motion.div>
						</div>
						<div
							className={`${classes.btn} ${isOn ? classes.btnNext : ''}`}
							onClick={toggleHandler}
						>
							{nextPage ? "Next" : "Save"}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Setting;
