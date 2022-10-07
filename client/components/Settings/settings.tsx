import classes from "../../styles/setting.module.css"
import Image from "next/image"
import CrossIcon from "../../public/FriendIcons/Cross.svg"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { HideSettings, Settings } from "../../store/UI-Slice"
import MsgSlideUp from "./slideUpMsg"
import { check2FACode, getQRcodeOrdisableCode, Is2FAEnaled } from "../../customHooks/useFetchData"
import { useRouter } from "next/router"
import { useRef } from "react"
import OtpInput from "react-otp-input-rc-17"

const variants = {
	open: { scale: 1 },
	closed: { scale: 0 },
	hide: { opacity: 0, scale: 0 },
}
const spring = {
	type: "spring",
	stiffness: 700,
	damping: 30,
}

const FirstPage: React.FC<{ isOn: boolean; toggleSwitch: () => void }> = (props) => {
	return (
		<>
			<div className={classes.SwitchContainer}>
				<span className={classes.title}>2 Factor Authentication</span>
				<div className={classes.switch} data-ison={props.isOn} onClick={props.toggleSwitch}>
					<motion.div className={classes.handle} layout transition={spring} />
				</div>
			</div>
		</>
	)
}

const SecondPage: React.FC<{
	QRcode: string
	inputValue: string
	codeFailed: boolean
	setIsOn: any
	setInputValue: any
}> = (props) => {
	const ref_input = useRef<OtpInput>(null)
	useEffect(() => {
		const elm = ref_input!.current as OtpInput
	}, [])

	return (
		<>
			<img src={props.QRcode} />
			<span>Please entre the OTP</span>
			<OtpInput
				ref={ref_input}
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
					props.setIsOn(e.length === 6)
					props.setInputValue(e)
				}}
				shouldAutoFocus={true}
				isInputNum={true}
			/>
		</>
	)
}

const Setting: React.FC = () => {
	const route = useRouter()
	const dispatch = useDispatch()
	const displayCard = useSelector(Settings)
	const [isValid, setIsValid] = useState(false)
	const [change, setchange] = useState(false)
	const [codeFailed, setcodeFailed] = useState(false)
	const [prevstat, setprevstat] = useState(false)
	const [isOn, setIsOn] = useState(false)
	const [QRcode, setQRcode] = useState("#")
	useEffect(() => {
		Is2FAEnaled(setprevstat, setIsOn, route)
	}, [])
	const toggleSwitch = () => {
		setIsOn(!isOn)
		setchange(true)
	}
	const toggleHandler = async () => {
		if (QRcode === "#") {
			const qrCode = await getQRcodeOrdisableCode("true", route)
			setQRcode(qrCode)
		} else if (QRcode !== "#" && inputValue.length === 6) {
			const res = await check2FACode(inputValue, route)
			setIsValid(res)
			setcodeFailed(!res)
			if (res) {
				setTimeout(() => {
					dispatch(HideSettings())
					setIsValid(false)
					setcodeFailed(false)
				}, 3000)
			}
		}
	}
	const [inputValue, setInputValue] = useState("")
	const handlerDisable = async () => {
		await getQRcodeOrdisableCode("false", route)
		setIsValid(true)
		setTimeout(() => {
			dispatch(HideSettings())
			setIsValid(false)
			setcodeFailed(false)
		}, 3000)
	}
	const sub = (e: any) => {
		e.preventDefault();
		if (inputValue.length === 6)
			toggleHandler();
	}
	return (
		<>
			{isValid && <MsgSlideUp msg="Done" colorCtn="#31BAAE" colorMsg="#ECF5FF" />}
			{!isValid && displayCard && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className={classes.background}
					onClick={(e) => {
						if (e.target != e.currentTarget) return
						setIsValid(false)
						setIsOn(false)
						dispatch(HideSettings())
					}}>
					<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={classes.settingContainer}>
						<div className={classes.header}>
							<span>Settings</span>
							<div
								className={classes.cross}
								onClick={() => {
									setIsValid(false)
									setIsOn(false)
									dispatch(HideSettings())
								}}>
								<Image src={CrossIcon} width="72" height="72" />
							</div>
						</div>
						<div className={classes.pages}>
							{QRcode === "#" && <FirstPage isOn={isOn} toggleSwitch={toggleSwitch} />}
							<motion.div
								defaultValue={"closed"}
								animate={QRcode !== "#" ? "open" : QRcode === "#" ? "hide" : "closed"}
								variants={variants}
								className={classes.qrCodeContainer}>
								{QRcode !== "#" && (
									<form onSubmit={sub}>
									<SecondPage
										QRcode={QRcode}
										inputValue={inputValue}
										setIsOn={setIsOn}
										setInputValue={setInputValue}
										codeFailed={codeFailed}
									/>
									<button style={{display: 'none'}}/>
									</form>
								)}
							</motion.div>
						</div>
						<div
							className={`${classes.btn} ${prevstat !== isOn ? classes.btnNext : ""}`}
							onClick={(QRcode === "#" && !isOn && handlerDisable) || toggleHandler}>
							{change && prevstat !== isOn && isOn ? (QRcode === "#" ? "Next" : "Save") : "Confirm"}
						</div>
					</motion.div>
				</motion.div>
			)}
		</>
	)
}

export default Setting
