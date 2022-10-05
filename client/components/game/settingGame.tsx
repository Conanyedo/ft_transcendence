import socket_game from "config/socketGameConfig"
import Image from "next/image"
import { useState } from "react"
import classes from "../../styles/Lobby.module.css"
import Cross from "../../public/FriendIcons/Cross.svg"
import Theme1 from "../../public/GameThemes/theme1.png"
import Theme2 from "../../public/GameThemes/theme2.png"
import Theme3 from "../../public/GameThemes/theme3.png"

const SettingGame: React.FC<{ sendGame: (id: string) => void; login: string; Hide: () => void}> = (props) => {
	const owner = localStorage.getItem("owner")
	const [themeselected, setThemeselected] = useState("1")
	const selectThemehandler = (e: React.MouseEvent<HTMLImageElement>) => {
		setThemeselected((e.target as HTMLImageElement).alt)
	}
	const StartHandler = () => {

		if (props.login)
			socket_game.emit(
				"newFriendGame",
				{ Theme: themeselected, friend: props.login, login: owner },
				(id: string) => {
					if (id)
						props.sendGame(id);
				}
			)
	}
	return (
		<div className={classes.BackGround}>
			<div className={classes.CardSetting}>
				<span>
					Game settings
					<span onClick={props.Hide}>
						<Image src={Cross} />
					</span>
				</span>
				<h2>Game Theme</h2>
				<p>Select a game theme you want to play on</p>
				<div className={classes.listTheme}>
					<div className={`${classes.Theme} ${themeselected === "1" && classes.selected}`}>
						<img src={Theme1.src} alt="1" onClick={selectThemehandler} />
					</div>
					<div className={`${classes.Theme} ${themeselected === "2" && classes.selected}`}>
						<img src={Theme2.src} alt="2" onClick={selectThemehandler} />
					</div>
					<div className={`${classes.Theme} ${themeselected === "3" && classes.selected}`}>
						<img src={Theme3.src} alt="3" onClick={selectThemehandler} />
					</div>
				</div>
				<div className={classes.btnContainer}>
					<div className={classes.Create} onClick={StartHandler}>
						Create
					</div>
				</div>
			</div>
		</div>
	)
}

export default SettingGame
