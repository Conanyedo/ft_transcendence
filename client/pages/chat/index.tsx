import Styles from "@styles/chat.module.css"
import Image from "next/image"
import Search from "@public/Icon.svg";
import Avatar from "@public/profile.jpg";
import Menu from "@public/three-dots.svg";
import sendArrow from "@public/send-arrow.svg";
import arrowBack from "@public/arrow-back.svg";
import { useState, useRef, useEffect } from "react";
import { setMsg, scrollToBottom } from "@utils/chat";
import { chatUser, chatMsg } from "@Types/dataTypes";
import { ModalBox } from "@components/Modal";
import { GameIconAsset, ChannelAsset, BlueChannelAsset } from "./svg/index"
import { ChatProvider } from "@contexts/chatContext"
import ContentWrapper from "@components/wrapper/appWrapper";
import { Profile } from "./components"
import { SettingsModal } from "@components/SettingsModal";

// Making a component for the invite msg

function InviteMsg(invitedUser: chatUser) {
	return (<div className={Styles.inviteMsg}>
		<div>
			<Image src={invitedUser.imgSrc} width={38} height={38} className={Styles.inviteAvatar} />
			<div>
				{invitedUser.fullName}
				<p>You invite them to play pong game</p>
			</div>
		</div>
		<button className={Styles.inviteBtn}>Cancel Invitation</button>
	</div>)
}

const Chat = () => {

	// Dummy data initializing

	const usersInitialState = [
		{ id: 0, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Online" },
		{ id: 1, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "In Game" },
		{ id: 2, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Offline" },
		{ id: 3, imgSrc: Avatar, fullName: "Chouaib Elwafa", status: "Offline" },
		{ id: 4, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "In Game" },
		{ id: 5, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Offline" },
		{ id: 6, imgSrc: Avatar, fullName: "Wafa cash", status: "Online" },
		{ id: 7, imgSrc: Avatar, fullName: "Youness Bouddou", status: "Online" },
		{ id: 8, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "In Game" },
		{ id: 9, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Online" },
		{ id: 10, imgSrc: Avatar, fullName: "Abdellah Belhachmi", status: "Offline" },
		{ id: 10, imgSrc: Avatar, fullName: "Amine Bidoud", status: "Offline" },
		{ id: 10, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Offline" },
		{ id: 10, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Offline" },
		{ id: 10, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Offline" },
		{ id: 10, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Offline" },
		{ id: 10, imgSrc: Avatar, fullName: "Oussama Oussama", status: "Offline" },
	];

	// Defining references
	const msgsDisplayDiv = useRef<any>();
	const messagesEndRef: HTMLDivElement | any = useRef<HTMLDivElement>(null);
	const chatUsersRefs: Array<HTMLDivElement> | any = useRef([]);
	const [showCnv, setShowCnv] = useState<boolean>(false);
	const [profile, setShowprofile] = useState(false);
	const [showSetModal, setShowSetModal] = useState(false);


	const setChatUser = (user: chatUser, chatUsersRefs: Array<HTMLDivElement>, i: number) => {

		// Unselect the previous user
		chatUsersRefs.current[prevUser].classList.remove(`${Styles.chatUserClicked}`);

		//Set current state of the user
		setCurrentUser(user);

		// Make the clicked div selectable
		chatUsersRefs.current[i].classList.add(`${Styles.chatUserClicked}`);
		setPrevUser(i);
		setShowCnv(true);
	}

	const [lastUsers, setLastUsers] = useState<Array<chatUser>>(usersInitialState);

	const [currentUser, setCurrentUser] = useState<chatUser>();
	const [enteredMsg, setEnteredMsg] = useState("");
	const [prevUser, setPrevUser] = useState<number>(0);
	const [show, setShow] = useState<boolean>(false);
	const [showMenuDropdown, setShowMenuDropdown] = useState(false)
	const [displayBlueIcon, setDisplayBlueIcon] = useState(false);

	const [chatMsgs, setChatMsgs] = useState<Array<chatMsg>>([
		{ msgContent: "Test1", time: "07:19 PM", type: "sender", name: "You" },
		{ msgContent: "Test2", time: "07:19 PM", type: "receiver", name: "Ikram Kharbouch" },
		{ msgContent: "Test3", time: "07:19 PM", type: "sender", name: "You" },
	]);

	// functions here

	function sendInvite() {
		if (currentUser !== undefined) {
			const newMsg = { msgContent: InviteMsg(currentUser), time: "07:19 PM", type: "sender", name: "You" };
			setChatMsgs([...chatMsgs, newMsg]);
		}
	}

	function createChannel(channelName: string, password: string, usrLen: number) {

		console.log(channelName);
		setShow(!show);

		const chatUser = { id: lastUsers.length, imgSrc: Avatar, channelName: channelName, status: usrLen === 10 ? "+" + usrLen + " Members" : usrLen + " Members" };

		setLastUsers([chatUser, ...lastUsers]);

		// select the current chat
		setChatUser(lastUsers[0], chatUsersRefs, 0);
	}

	function filterChatUsers(e: React.ChangeEvent<HTMLInputElement>) {
		let value = e.target.value.toUpperCase();
		// Return to initial state 
		if (value == "") {
			setLastUsers(usersInitialState);
			return;
		}

		// Filter out results
		let newUsers: Array<chatUser> = lastUsers.filter((user: chatUser) => user?.fullName?.toUpperCase().includes(value));

		console.log(newUsers);
		setLastUsers(newUsers);
	}

	function showProfile() {
		console.log("show settings");
		console.log(profile);
		if (!profile) {
			console.log("entered here")
			setShowprofile(true);
		}
	}

	function showUsrMenu() {
		setShowMenuDropdown(!showMenuDropdown);
	}

	// UseEffect here
	useEffect(() => {
		scrollToBottom(messagesEndRef);
		setCurrentUser(lastUsers[0]);
	}, [lastUsers])

	return (
		<ContentWrapper children={
			<ChatProvider>
				<SettingsModal showSetModal={showSetModal} setShowSetModal={setShowSetModal} />
				<div className={Styles.chatContainer}>
					<div className={`${Styles.chatLeft} ${showCnv ? Styles.hideUsers : ""}`}>
						<div className={Styles.leftContent}>
							<div className={Styles.topSection}>
								<div className={Styles.msg}>Message</div>
								{!displayBlueIcon && <div onClick={() => setShow(!show)} className={Styles.channel} onMouseOver={() => setDisplayBlueIcon(true)}><ChannelAsset color="#758293" /></div>}
								{displayBlueIcon && <div onMouseLeave={() => setDisplayBlueIcon(false)} className={Styles.channel} onClick={() => setShow(!show)}><BlueChannelAsset /></div>}
								<ModalBox show={show} setShow={setShow} createChannel={createChannel} />
							</div>
							<div className={Styles.chatSearch}>
								<Image src={Search} width={20} height={20} />
								<input type="Text" className={Styles.chatInput} placeholder="Search" onChange={(e) => filterChatUsers(e)} />
							</div>
							<div className={Styles.bottomSection}>
								{lastUsers.map((user, i) => <div key={i} ref={(element) => { chatUsersRefs.current[i] = element }} className={Styles.chatUser} onClick={() => setChatUser(user, chatUsersRefs, i)}>
									<div className={Styles.avatarName}>
										<Image src={user.imgSrc} width={49.06} height={49} className={Styles.avatar} />
										<div className={Styles.username}>{user.fullName} {user.channelName}</div>
									</div>
									<p className={Styles.status}>{user.status}</p>
								</div>)}
							</div>
						</div>
					</div>
					<div className={`${Styles.chatRight} ${showCnv ? Styles.displayChat : ""}`}>
						<div className={Styles.rightContent}>
							{currentUser && (<>
								<div className={Styles.topDetails}>
									<div className={Styles.flex}>
										<div className={Styles.arrowAsset}>
											<Image src={arrowBack} width={16} height={16} onClick={() => setShowCnv(false)} />
										</div>
										{profile && <div className={Styles.arrowAsset}>
												<Image src={arrowBack} width={16} height={16} />
										</div>}
										<div onClick={currentUser?.channelName ? showProfile : () => null} className={Styles.flex}>
											<div className={Styles.avatarProps}>
												<Image src={currentUser?.imgSrc} width={76} height={76} className={Styles.avatar} />
											</div>
											<div>
												<h1 className={Styles.chatUsername}>{currentUser?.channelName ? currentUser.channelName : currentUser?.fullName}</h1>
												<p className={Styles.chatUserStatus}>{currentUser?.status}</p>
											</div>
										</div>

									</div>
									<div className={Styles.menu} onClick={showUsrMenu}><svg width="6" height="30" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M2 0.250031C2.9665 0.250031 3.75 1.03353 3.75 2.00003C3.75 2.96653 2.9665 3.75003 2 3.75003C1.0335 3.75003 0.250001 2.96653 0.250001 2.00003C0.250001 1.03353 1.0335 0.25003 2 0.250031Z" fill="#D9D9D9" />
										<path d="M2 7.25003C2.9665 7.25003 3.75 8.03353 3.75 9.00003C3.75 9.96653 2.9665 10.75 2 10.75C1.0335 10.75 0.25 9.96653 0.25 9.00003C0.25 8.03353 1.0335 7.25003 2 7.25003Z" fill="#D9D9D9" />
										<path d="M2 14.25C2.9665 14.25 3.75 15.0335 3.75 16C3.75 16.9665 2.9665 17.75 2 17.75C1.0335 17.75 0.25 16.9665 0.25 16C0.25 15.0335 1.0335 14.25 2 14.25Z" fill="#D9D9D9" />
									</svg>

										{showMenuDropdown && <div className={Styles.menuDropdown}>
											<div onClick={() => setShowSetModal(true)}>Settings</div>
											<div>Leave Channel</div>
										</div>}
									</div>

								</div>
								{profile && (<Profile />)}
								{currentUser && !profile && <div className={Styles.chatSection}>
									<div className={Styles.msgsDisplay} ref={msgsDisplayDiv}>
										{
											chatMsgs.map((chatMsg, i) => <div key={i} className={Styles.chatMsg} style={{ left: chatMsg.type == "receiver" ? "0" : "auto", right: chatMsg.type == "sender" ? "0" : "auto" }}>
												<div className={Styles.msgBox} style={{ justifyContent: chatMsg.type == "receiver" ? "flex-start" : "flex-end" }}>
													<div ref={messagesEndRef} className={Styles.msgContent} style={{ backgroundColor: chatMsg.type == "receiver" ? "#3A3A3C" : "#409CFF", borderRadius: chatMsg.type == "receiver" ? "0 5px 5px 5px" : "5px 5px 0 5px" }}>
														{chatMsg.msgContent}
													</div>
												</div>
												<div className={Styles.msgTime} style={{ justifyContent: chatMsg.type == "receiver" ? "flex-start" : "flex-end" }}>{chatMsg.time}</div>
											</div>)
										}
									</div>
									<div className={Styles.sendDiv} style={{ gap: enteredMsg != "" ? "1.5rem" : "0" }}>
										<div className={Styles.msgInput}>
											<input type="text" placeholder="message" value={enteredMsg} onChange={(e) => setEnteredMsg(e.target.value)} onKeyDown={(event) => setMsg(enteredMsg, event.keyCode, setChatMsgs, chatMsgs, setEnteredMsg)} />
											<div onClick={sendInvite} className={Styles.console}><GameIconAsset color="#D9D9D9" /></div>
										</div>
										<div onClick={() => setMsg(enteredMsg, 13, setChatMsgs, chatMsgs, setEnteredMsg)} className={Styles.sendCtr}>{enteredMsg && <Image src={sendArrow} width={30} height={30} className={Styles.animatedBtn} />}</div>
									</div>

								</div>}
							</>)}

							{!currentUser && (<div className={Styles.newCnv}>
								<h1>Start a new conversation</h1>
							</div>)}

						</div>
					</div>
				</div>
			</ChatProvider>}
		/>
	);
};
export default Chat;
