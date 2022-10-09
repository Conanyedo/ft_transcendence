import { motion } from "framer-motion"
import classes from "../../styles/homePage.module.css"
import { useRouter } from "next/router"
import { baseUrl } from "../../config/baseURL"
import { useEffect, useRef, useState } from "react"
import LoadingElm from "../loading/Loading_elm"
import Pongmania from "../../public/Pongmania.svg"
import logo from "../../public/1337_logo.svg"
import mute from "../../public/Volume-off.svg"
import muteselected from "../../public/Volume-off_selected.svg"
import sound from "../../public/Volume-on.svg"
import soundselected from "../../public/Volume-on_selected.svg"

const Login = () => {
	const router = useRouter()
	const [isMounted, setIsMounted] = useState(false)
	const [isMute, setIsMute] = useState(false)
	const ref_music = useRef<HTMLAudioElement>(null)
	useEffect(() => {
		setIsMounted(true)
	}, [])
	if (!isMounted) return <LoadingElm />

	const setinMute = () => {
		setIsMute((value) => {
			const elm: HTMLAudioElement = ref_music!.current as HTMLAudioElement
			if (value) elm.play()
			else elm.pause()
			return !value
		})
	}
	return (
		<>
			{isMounted && <motion.div
				initial={{ y: 10, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: -10, opacity: 0 }}
				transition={{ duration: 0.5 }}
				className={classes.body}>
				<div className={classes.header}>
					<div className={classes._1337logo}>
						<img src={logo.src} alt="1337_official_logo" />
					</div>
					{/* <div className={classes.aboutUs}>About Us</div> */}
				</div>
				<div className={classes.pongmania_container}>
					<div className={classes.pongmania_content}>
						<object data={Pongmania.src} type="image/svg+xml"></object>
						<p>
						Come join us for some friendly ping pong games and great conversation on our platform.<br/>You don't need to be a professional player to enjoy a game of ping pong, and you're sure to make some new friends and chat with them. So come over and have some fun!
						</p>
					</div>
					<div className={classes.login_button} onClick={(e) => router.push(`${baseUrl}auth/login`)}>
						42 Login
					</div>
				</div>
				<div className={classes.footer}>
					<p>
						Made with <span>♥️</span> by{" "}
						<span className={classes.contributors}>
							<a href="https://github.com/Conanyedo">Younes Bouddou</a> -{" "}
							<a href="https://github.com/cabouelw">Choaib Abouelwafa</a> -{" "}
							<a href="https://github.com/ikramkharbouch"> Ikram Kharbouch</a>
						</span>
					</p>
					<div className={classes.sound} onClick={setinMute}>
						{(isMute && (
							<>
								<img src={mute.src} className={classes.mute} alt="UnMute" />
								<img src={muteselected.src} className={classes.muteSelected} alt="UnMute" />
							</>
						)) || (
							<>
								<img src={sound.src} className={classes.mute} alt="Mute" />
								<img src={soundselected.src} className={classes.muteSelected} alt="Mute" />
							</>
						)}
					</div>
				</div>
				<audio controls autoPlay={true} loop={true} className={classes.audio} ref={ref_music}>
					<source src="luffy.mp3" type="audio/mpeg" />
					Your browser does not support the audio element.
				</audio>
			</motion.div>}
		</>
	)
}

export default Login
