
import { motion } from "framer-motion";
import classes from "../../styles/homePage.module.css";
import { useRouter } from "next/router";
import { baseUrl } from "../../config/baseURL";
import { useEffect, useRef, useState } from "react";
import LoadingElm from "../loading/Loading_elm";
import mute from "../../public/Volume-off.svg"
import muteselected from "../../public/Volume-off_selected.svg"
import sound from "../../public/Volume-on.svg"
import soundselected from "../../public/Volume-on_selected.svg"
import logo from "../../public/1337_logo.svg"
import Pongmania from "../../public/Pongmania.svg"

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
			const elm: HTMLAudioElement = ref_music!.current as HTMLAudioElement;
			if (value) elm.play()
			else elm.pause()
			return !value
		})
	}
	return (
		<div className={classes.body}>
			<div className={classes.header}>
				<div className={classes._1337logo}>
					<img src={logo.src} alt="1337_official_logo" />
				</div>
				<div className={classes.aboutUs}>About Us</div>
			</div>
			<div className={classes.pongmania_container}>
				<div className={classes.pongmania_content}>
					<object data={Pongmania.src} type="image/svg+xml"></object>
					<p>
						Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
						the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
						of type.
					</p>
				</div>
				<div className={classes.login_button} onClick={(e) => router.push(`${baseUrl}auth/login`)} >42 Login</div>
			</div>
			<div className={classes.footer}>
				<p>
					Made with <span>♥️</span> by{" "}
					<span className={classes.contributors}>
						<a href="https://github.com/Conanyedo">Youuness Bouddou</a> -{" "}
						<a href="https://github.com/ikramkharbouch"> Ikram Kharbouch</a> -{" "}
						<a href="https://github.com/cabouelw">Choaib Abouelwafa</a>
					</span>
				</p>
			</div>
			
		</div>
	)
}

export default Login;
