import Image from "next/image";
import classes from "../../styles/GameLobby.module.css";
import classesELM from "../../styles/Loading.module.css";
import classesGameHeader from "../../styles/liveGame.module.css";
import { EmtyUser, gameControleType, UserTypeNew } from "../../Types/dataTypes";
import React, { useEffect, useRef, useState } from "react";
import { render } from "../../config/game";
import socket_game from "../../config/socketGameConfig";
import { useRouter } from "next/router";
import { allTheme } from "config/gameMap";
import { fetchDATA } from "@hooks/useFetchData";
import { getImageBySize, getRankUser, runTimer } from "@hooks/Functions";
import { useDispatch } from "react-redux";
import MsgSlideUp from "@components/Settings/slideUpMsg";

const GameHeader: React.FC<{
	gameID: string;
	Fplayer: string;
	Splayer: string;
}> = (props) => {
	const router = useRouter();
	const [userInfo1, setUserInfo1] = useState<UserTypeNew>(EmtyUser);
	const [userInfo2, setUserInfo2] = useState<UserTypeNew>(EmtyUser);
	const [isMounted, setisMounted] = useState(false);

	useEffect(() => {
		setisMounted(true);
	}, [])

	useEffect(() => {
		if (props.Fplayer)
			fetchDATA(setUserInfo1, router, `user/info/${props.Fplayer}`);
		if (props.Splayer)
			fetchDATA(setUserInfo2, router, `user/info/${props.Splayer}`);
	}, [props.Splayer]);
	const rank1 = getRankUser(userInfo1.stats.GP);
	const rank2 = getRankUser(userInfo2.stats.GP);
	const pathImage1 = getImageBySize(userInfo1?.avatar, 70);
	const pathImage2 = getImageBySize(userInfo2?.avatar, 70);
	const goToFirstProfile = () => router.push("/profile/" + userInfo1.login);
	const goToSecondProfile = () => router.push("/profile/" + userInfo2.login);
	return (
		<>
			{isMounted && <div className={classesGameHeader.liveGameContainer}>
				<div className={classesGameHeader.GameContent}>
					<div className={classesGameHeader.UserSection}>
						<div
							className={classesGameHeader.userNameAvatar}
							onClick={goToFirstProfile}
						>
							<div className={classesGameHeader.avatar}>
								<img src={pathImage1} />
							</div>
							<div className={classesGameHeader.userName}>
								{userInfo1.fullname.split(" ")[0]}
							</div>
						</div>
						<div className={classesGameHeader.ScoreTier}>
							<div className={classesGameHeader.tierContainer}>
								<Image src={rank1.tier} />
							</div>
							<div className={classesGameHeader.Score}>0</div>
						</div>
					</div>
					<div className={classesGameHeader.vs}>VS</div>
					<div className={classesGameHeader.UserSectionSecond}>
						<div className={classesGameHeader.ScoreTier}>
							<div className={classesGameHeader.Score}>0</div>
							<div
								className={
									classesGameHeader.tierContainerSecond
								}
							>
								<Image src={rank2.tier} />
							</div>
						</div>
						<div
							className={classesGameHeader.userNameAvatar}
							onClick={goToSecondProfile}
						>
							<div className={classesGameHeader.secondUserName}>
								{userInfo2.fullname.split(" ")[0]}
							</div>
							<div className={classesGameHeader.secondavatar}>
								<img src={pathImage2} />
							</div>
						</div>
					</div>
				</div>
			</div>}
		</>
	);
};

class GameFriendType {
	gameID: string = "";
	admin: string = "";
	friend: string = "";
	theme: string = "";
}

const GameLobby: React.FC<{ GameID: string }> = (props) => {
	const gameData: gameControleType = new gameControleType(1500);
	const [datagame, setDataGame] = useState<GameFriendType>();
	const [startGame, setStartGame] = useState(false);
	const [ErrorMsg, setErrorMsg] = useState(false);
	const [isMounted, setisMounted] = useState(false);
	const [calledPush, setCalledPush] = useState(false);
	const ref_canvas = useRef(null);
	const ref_span = useRef(null);
	const router = useRouter();
	useEffect(() => {
		socket_game.emit("FriendGameInfo", props.GameID, (data: any) => {
			setDataGame(data);
			render(gameData, ref_canvas.current, allTheme[Number(data.Theme)]);
		});
		socket_game.on("gameStarted", (data) => {
			if (data === true) {
				let rep: NodeJS.Timer;
				setStartGame(true);
				rep = runTimer(ref_span.current);
				setTimeout(() => {
					clearInterval(rep)
					if (!calledPush) {
					router.replace('/game/' + props.GameID);
					setCalledPush(true);
					}
				}, 4000);
			} else {
				setErrorMsg(true);
			}
		});
		socket_game.emit('isGameStarted', props.GameID);
		setisMounted(true)
		return () => {
			socket_game.off("gameStarted");
		};
	}, []);
	const cancelHandler = () => {
		socket_game.emit("removeGameLobby", props.GameID);
		router.push("/game");
	};

	if (ErrorMsg) {
		const time = setTimeout(() => {
			setErrorMsg(false);
			router.push("/game");
		  return () => {
				clearTimeout(time);
		  }
		}, 3000);
	  }
	return (<>
		{isMounted && <div className={classes.fullPage}>
			{ErrorMsg && (
				<MsgSlideUp
					msg="game refused"
					colorCtn="#FF6482"
					colorMsg="#ECF5FF"
				/>
			)}
			{!ErrorMsg &&<div className={classes.BackGround}>
				<div className={classes.Waiting}>
					{(startGame && (
						<>
							<div>
								<span ref={ref_span}>4</span>
							</div>
							<span>Game will start soon</span>
						</>
					)) ||  (
						<>
							<div
								className={`${classesELM["pong-loader"]} ${classes.loading}`}
							/>
							<span>Waiting for your opponent</span>
							<div
								className={classes.cancelbtn}
								onClick={cancelHandler}
							>
								Cancel
							</div>
						</>
					)}
				</div>
			</div>}
			<div className={classes.GameContainer}>
				<GameHeader
					gameID={props.GameID as string}
					Fplayer={datagame?.admin as string}
					Splayer={datagame?.friend as string}
				/>
				<canvas
					width={gameData.canvasWidth}
					height={gameData.canvasHieght}
					ref={ref_canvas}
					id="pong"
				></canvas>
			</div>
		</div>}
		</>
	);
};

export default GameLobby;
