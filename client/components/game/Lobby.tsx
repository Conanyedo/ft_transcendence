import { getCookie } from "cookies-next";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import classes from "../../styles/Lobby.module.css";

import down from "../../public/Game/Down.svg";
import Cross from "../../public/FriendIcons/Cross.svg";
import Image from "next/image";
import GameLobby from "./GameLobby";
import Queue from "./Queue";
import socket_game from "../../config/socketGameConfig";

const Friend = () => {
	return (
		<>
			<div className={classes.Friend}>
				<div className={classes.avatar}>
					<img src="#" />
				</div>
				<div className={classes.Name}>Azziz Chraibi</div>
				<div className={classes.btnSelect}>Select</div>
			</div>
		</>
	);
};

export const FriendGameSetting: React.FC<{
	Hide: () => void;
	setGamePage: Dispatch<SetStateAction<boolean>>;
}> = (props) => {
	const [friendSelected, setFriendSelected] = useState("");
	const [isOpen, setisOpen] = useState(false);
	const ref_input = useRef(null);
	const ClickHandler = () => setisOpen((v) => !v);
	const SearchHandler = () => {
		setisOpen(true);
		setFriendSelected(ref_input.current!.value);
	};
	const StartHandler = () => {
		props.setGamePage(true);
		props.Hide();
	};
	return (
		<div className={classes.BackGround}>
			<div className={classes.CardSetting}>
				<span>
					Game settings{" "}
					<span onClick={props.Hide}>
						<Image src={Cross} />
					</span>
				</span>
				<h2>Game Theme</h2>
				<p>Select a game theme you want to play on</p>
				<div className={classes.listTheme}>
					<div className={`${classes.Theme} ${classes.selected}`}>
						<img src="#" />
					</div>
					<div className={classes.Theme}>
						<img src="#" />
					</div>
					<div className={classes.Theme}>
						<img src="#" />
					</div>
				</div>
				<h2>Invite Friend</h2>
				<p>Choose a friend you want to play with</p>
				<div className={classes.selectContainer}>
					<div className={classes.select}>
						<input
							ref={ref_input}
							value={friendSelected}
							onChange={SearchHandler}
						/>
						<div className={classes.icon} onClick={ClickHandler}>
							<Image src={down} />
						</div>
						{isOpen && (
							<div className={classes.ListFriend}>
								<Friend />
								<Friend />
								<Friend />
							</div>
						)}
					</div>
					<div className={classes.Create} onClick={StartHandler}>
						Create
					</div>
				</div>
			</div>
		</div>
	);
};

const Lobby = () => {
	const [cardisOpen, setCardisOpen] = useState(false);
	const [GamePage, setGamePage] = useState(false);
	const [QueuePage, setQueuePage] = useState(false);
	const closeHandler = () => {
		setGamePage(false);
	};
	const ShowCardHandler = () => {
		setCardisOpen(true);
	};
	const HideCardHandler = () => setCardisOpen(false);
	const joinRankHandler = () => {
		setQueuePage(true)
	};
	useEffect(() => {
		socket_game.connect();
		return (() => {
			// socket_game.disconnect();
		})
	}, [])
	return (
		<>
			{QueuePage && <Queue cancel={setQueuePage}/>}
			{GamePage && !QueuePage && <GameLobby close={closeHandler} />}
			{!GamePage && !QueuePage && (
				<>
					{cardisOpen && (
						<FriendGameSetting
							Hide={HideCardHandler}
							setGamePage={setGamePage}
						/>
					)}
					<div className={classes.LobbyContainer}>
						<span>Game Lobby</span>
						<div className={classes.pingPongContainer}>
							<span>Pong Game</span>
							<p>
								Lorem ipsum dolor sit amet consectetur
								adipiscing elit Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien
								fringilla, mattis ligula consectetur, ultrices
								mauris. Maecenas vitae mattis tellus. Nullam
								quis.
							</p>
						</div>
						<div className={classes.cardContainers}>
							<div className={classes.RankContainer}>
								<span>Ranked Game</span>
								<p>
									Lorem ipsum dolor sit amet consectetur
									adipiscing elit Ut et massa mi. Aliquam in
									hendrerit urna. Pellentesque sit amet sapien
									fringilla, mattis ligula consectetur,
									ultrices mauris. Maecenas vitae mattis
									tellus. Nullam quis.
								</p>
								<p>
									Lorem ipsum dolor sit amet consectetur
									adipiscing elit Ut et massa mi. Aliquam in{" "}
								</p>
								<div className={classes.JoinQueue} onClick={joinRankHandler}>
									Join Queue
								</div>
							</div>
							<div className={classes.RankContainer}>
								<span>Friend Game</span>
								<p>
									Lorem ipsum dolor sit amet consectetur
									adipiscing elit Ut et massa mi. Aliquam in
									hendrerit urna. Pellentesque sit amet sapien
									fringilla, mattis ligula consectetur,
									ultrices mauris. Maecenas vitae mattis
									tellus. Nullam quis.
								</p>
								<p>
									Lorem ipsum dolor sit amet consectetur
									adipiscing elit Ut et massa mi. Aliquam in{" "}
								</p>
								<div
									className={classes.JoinQueue}
									onClick={ShowCardHandler}
								>
									Invite Friend
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default Lobby;
