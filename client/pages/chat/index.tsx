import Styles from "@styles/chat.module.css"
import Image from "next/image"
import Search from "@public/Icon.svg";
import Avatar from "@public/profile.jpg";
import Menu from "@public/Options-gray.svg";
import sendArrow from "@public/send-arrow.svg";
import arrowBack from "@public/arrow-back.svg";
import { useState, useRef, useEffect, RefObject } from "react";
import { setMsg, scrollToBottom } from "@utils/chat";
import { chatUser, chatMsg } from "@Types/dataTypes";
import { ModalBox } from "@components/Modal";
import { GameIconAsset, ChannelAsset } from "./svg/index";
import { ChatProvider, ChatContext, ChatContextType } from "@contexts/chatContext"


// Making a component for the invite msg

function InviteMsg(invitedUser: chatUser) {
	return (<div className={Styles.inviteMsg}>
		<div>
			<Image src={invitedUser.imgSrc} width={38} height={38} className={Styles.inviteAvatar} />
			<div>
				{invitedUser.firstName + " " + invitedUser.lastName}
				<p>You invite them to play pong game</p>
			</div>
		</div>
		<button className={Styles.inviteBtn}>Cancel Invitation</button>
	</div>)
}

const Chat = () => {

	// Defining references
	const msgsDisplayDiv = useRef<any>();
	const messagesEndRef: HTMLDivElement | any = useRef<HTMLDivElement>(null);
	const chatUsersRefs: Array<HTMLDivElement> | any = useRef([]);
	const gameIconRef: any = useRef(null);
	const [showCnv, setShowCnv] = useState<boolean>(false);


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

	const lastUsers: Array<chatUser> = [
		{ id: 0, imgSrc: Avatar, firstName: "Youness", lastName: "Santir", status: "Online" },
		{ id: 1, imgSrc: Avatar, firstName: "Youness", lastName: "Crew", status: "In Game" },
		{ id: 2, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Offline" },
		{ id: 3, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Offline" },
		{ id: 4, imgSrc: Avatar, firstName: "Black", lastName: "Youness", status: "In Game" },
		{ id: 5, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Offline" },
		{ id: 6, imgSrc: Avatar, firstName: "Abdellah", lastName: "Black", status: "Online" },
		{ id: 7, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Online" },
		{ id: 8, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "In Game" },
		{ id: 9, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Online" },
		{ id: 10, imgSrc: Avatar, firstName: "Fahd", lastName: "Adib", status: "Offline" },
		{ id: 10, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Offline" },
		{ id: 10, imgSrc: Avatar, firstName: "Fahd", lastName: "Fahd", status: "Offline" },
		{ id: 10, imgSrc: Avatar, firstName: "Farid", lastName: "Belhachmi", status: "Offline" },
		{ id: 10, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Offline" },
		{ id: 10, imgSrc: Avatar, firstName: "Fahd", lastName: "Fahd", status: "Offline" },
		{ id: 10, imgSrc: Avatar, firstName: "Farid", lastName: "Belhachmi", status: "Offline" },
	]

	const [currentUser, setCurrentUser] = useState<chatUser>(lastUsers[0]);
	const [enteredMsg, setEnteredMsg] = useState("");
	const [prevUser, setPrevUser] = useState<number>(0);
	const [show, setShow] = useState<boolean>(false);

	const [chatMsgs, setChatMsgs] = useState<Array<chatMsg>>([
		{ msgContent: "Test1", time: "07:19 PM", type: "sender", name: "You" },
		{ msgContent: "Test2", time: "07:19 PM", type: "receiver", name: "Ikram Kharbouch" },
		{ msgContent: "Test3", time: "07:19 PM", type: "sender", name: "You" },
	]);

	// functions here

	function sendInvite() {
		const newMsg = { msgContent: InviteMsg(currentUser), time: "07:19 PM", type: "sender", name: "You" };
		setChatMsgs([...chatMsgs, newMsg]);
	}

	function createChannel() {
		setShow(!show);
	}

	// UseEffect here
	useEffect(() => {
		scrollToBottom(messagesEndRef);
	}, [chatMsgs])

	return (
		<>
			<ChatProvider>
				<div className={Styles.chatContainer}>
					<div className={`${Styles.chatLeft} ${showCnv ? Styles.hideUsers : ""}`}>
						<div className={Styles.leftContent}>
							<div className={Styles.topSection}>
								<h1 className={Styles.msg}>Message</h1>
								<div onClick={createChannel} className={Styles.channel}><ChannelAsset color="#758293" /></div>
								<ModalBox show={show} setShow={setShow} />
							</div>
							<div className={Styles.chatSearch}>
								<Image src={Search} width={20} height={20} />
								<input type="Text" className={Styles.chatInput} placeholder="Search" />
							</div>
							<div className={Styles.bottomSection}>
								{lastUsers.map((user, i) => <div ref={(element) => { chatUsersRefs.current[i] = element }} className={Styles.chatUser} onClick={() => setChatUser(user, chatUsersRefs, i)}>
									<div className={Styles.avatarName}>
										<Image src={user.imgSrc} width={49.06} height={49} className={Styles.avatar} />
										<div className={Styles.username}>{user.firstName} {user.lastName}</div>
									</div>
									<p className={Styles.status}>{user.status}</p>
								</div>)}
							</div>
						</div>
					</div>
					<div className={`${Styles.chatRight} ${showCnv ? Styles.displayChat : ""}`}>
						<div className={Styles.rightContent}>
							<div className={Styles.topDetails}>
								<div className={Styles.flex}>
									<div className={Styles.arrowAsset}>
										<Image src={arrowBack} width={16} height={16} onClick={() => setShowCnv(false)} />
									</div>
									<div className={Styles.avatarProps}>
										<Image src={currentUser.imgSrc} width={76} height={76} className={Styles.avatar} />
									</div>
									<div>
										<h1 className={Styles.chatUsername}>{currentUser.firstName + " " + currentUser.lastName}</h1>
										<p className={Styles.chatUserStatus}>{currentUser.status}</p>
									</div>
								</div>
								<div className={Styles.menu}><Image src={Menu} width={30} height={30} /></div>
							</div>
							<div className={Styles.chatSection}>
								<div className={Styles.msgsDisplay} ref={msgsDisplayDiv}>
									{
										chatMsgs.map((chatMsg) => <div className={Styles.chatMsg} style={{ left: chatMsg.type == "receiver" ? "0" : "auto", right: chatMsg.type == "sender" ? "0" : "auto" }}>
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

							</div>
						</div>
					</div>
				</div>
			</ChatProvider>
		</>
	);
};
export default Chat;
