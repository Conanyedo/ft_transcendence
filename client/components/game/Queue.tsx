import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import socket_game from "../../config/socketGameConfig";
import { getImageBySize, getRankUser } from "../../customHooks/Functions";
import classes from "../../styles/Queue.module.css";
import classesELM from "../../styles/Loading.module.css";
import { EmtyUser, UserTypeNew } from "../../Types/dataTypes";
import { fetchDATA } from "../../customHooks/useFetchData";

const CardPlayer: React.FC<{ Loading: boolean, login: string }> = ({ Loading, login }) => {
	const router = useRouter();
	const [userInfo, setUserInfo] = useState<UserTypeNew>(EmtyUser);
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		if (login)
			fetchDATA(setUserInfo, router, `user/info/${login}`);
		setIsMounted(true);
		return () => {
			setUserInfo(EmtyUser);
		};
	}, [login]);
	const rank = getRankUser(userInfo.stats.GP);
	const pathImage = getImageBySize(userInfo?.avatar, 220);
	return (
		<>
			{isMounted && <div className={classes.Card}>
				{(Loading && (
					<>
						<div
							className={`${classesELM["pong-loader"]} ${classes.loading}`}
						/>
						<p>Waiting for player ...</p>
					</>
				)) || (
					<>
						<div className={classes.items}>
							<div className={classes.imgContainer}>
								<img src={pathImage} />
							</div>
							<div className={classes.NAme}>{userInfo.fullname}</div>
						</div>
						<div className={classes.items}>
							<div className={classes.imgContainer}>
								<Image src={rank.tier} />
							</div>
							<div className={classes.rank}>Rank {userInfo.rank}</div>
						</div>
					</>
				)}
			</div>}
		</>
	);
};

const Queue: React.FC<{ cancel: (t: string) => void }> = ({
	cancel,
}) => {
	const router = useRouter();
	const [waiting, setWaiting] = useState('');
	const owner = localStorage.getItem("owner") as string;
	useEffect(() => {
		socket_game.connect();
		socket_game.emit("joinGame", owner);
		socket_game.on("errorCheck", (data) => {
			cancel('error');
		});
		socket_game.on("getCode", (data) => {
			setWaiting(data.login);
			const time = setTimeout(() => {
				router.push("/game/" + data.id);
			}, 5000);
			return () => {
				clearTimeout(time);
			};
		});
		return () => {
			socket_game.off("getCode");
			socket_game.off("errorCheck");
		};
	}, []);
	const GoBackHandler = () => {
		socket_game.emit("leaveQueue", owner);
		cancel('');
	};
	return (
		<>
			<div className={classes.GameQueueContainer}>
				<h1>Game Queue</h1>
				<p>
					You have been placed in the queue to play a ranked game.
					<br />
					Thank you for your patience.
				</p>
				<div className={classes.CardsContainer}>
					<CardPlayer Loading={false} login={owner} />
					<CardPlayer Loading={(waiting === '' ? true : false)} login={waiting} />
				</div>
				{waiting === '' && (
					<div className={classes.btnLeave} onClick={GoBackHandler}>
						Leave Queue
					</div>
				)}
			</div>
		</>
	);
};

export default Queue;
