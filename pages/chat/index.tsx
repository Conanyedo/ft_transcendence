import Styles from "../../styles/chat.module.css"
import Image, { StaticImageData } from "next/image"
import NewMessage from "../../public/new-message.svg"
import Search from "../../public/Icon.svg";
import Avatar from "../../public/profile.jpg";
import Menu from "../../public/Options-gray.svg";
import Console from "../../public/Console.svg";
import { useState, useRef, useEffect, RefObject } from "react";
import { setMsg, showConversation } from "../../functions/chat";

interface chatUser {
	id: number;
	imgSrc: StaticImageData;
	firstName: string;
	lastName: string;
	status: string
  }

const Chat = () => {

	// Defining references
	const msgsDisplayDiv = useRef<any>();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const chatUsersRefs: Array<HTMLDivElement> | any = useRef([]);

	const [chatMsgs, setChatMsgs] = useState([
		{msgContent: "Test1", time: "07:19 PM", type: "sender", name: "You"}, 
		{msgContent: "Test2", time: "07:19 PM", type: "receiver", name: "Ikram Kharbouch"}, 
		{msgContent: "Test3", time: "07:19 PM", type: "sender", name: "You"}
	]);

	const lastUsers = [
		{ id: 0, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Online" },
		{ id: 1, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "In Game" },
		{ id: 2, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Offline" },
		{ id: 3, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Offline" },
		{ id: 4, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "In Game" },
		{ id: 5, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Offline" },
		{ id: 6, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Online" },
		{ id: 7, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Online" },
		{ id: 8, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "In Game" },
		{ id: 9, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Online" },
		{ id: 10, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Offline" },
	]

	const [currentUser, setCurrentUser] = useState<chatUser>(lastUsers[0]);
	const [enteredMsg, setEnteredMsg] = useState("");
	const [prevUser, setPrevUser] = useState<number>(0)

	// functions here
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}

	const setChatUser = (user: chatUser, chatUsersRefs:Array<HTMLDivElement>, i:number) => {

		// Unselect the previous user
		chatUsersRefs.current[prevUser].classList.remove(`${Styles.chatUserClicked}`);

		console.log("clicked")
		//Set current state of the user
		setCurrentUser(user);
		
		// Make the clicked div selectable
		chatUsersRefs.current[i].classList.add(`${Styles.chatUserClicked}`);
		setPrevUser(i);
	}

	// UseEffect here
	useEffect(() => {
		scrollToBottom();
	}, [chatMsgs])

	
	return (
		<>
			<div className={Styles.chatContainer}>
				<div className={Styles.chatLeft}>
					<div className={Styles.leftContent} onClick={showConversation}>
						<div className={Styles.topSection}>
							<h1 className={Styles.msg}>Message</h1>
							<Image src={NewMessage} width={20} height={20} />
						</div>
						<div className={Styles.chatSearch}>
							<Image src={Search} width={20} height={20} />
							<input type="Text" className={Styles.chatInput} placeholder="Search" />
						</div>
						<div className={Styles.bottomSection}>
							{lastUsers.map((user, i) => <div ref={(element) => {chatUsersRefs.current[i] = element}} className={Styles.chatUser} onClick={() => setChatUser(user, chatUsersRefs, i)}>
								<div className={Styles.avatarName}>
									<Image src={user.imgSrc} width={49.06} height={49} className={Styles.avatar} />
									<h3 className={Styles.username}>{user.firstName} {user.lastName}</h3>
								</div>
								<p className={Styles.status}>{user.status}</p>
							</div>)}
						</div>

					</div>
				</div>
				<div className={Styles.chatRight}>
					<div className={Styles.rightContent}>
						<div className={Styles.topDetails}>
							<div className={Styles.flex}>
								<Image src={currentUser.imgSrc} width={76} height={76} className={Styles.avatar} />
								<div>
									<h1 className={Styles.chatUsername}>{currentUser.firstName + " " + currentUser.lastName}</h1>
									<p className={Styles.chatUserStatus}>{currentUser.status}</p>
								</div>
							</div>
							<Image src={Menu} width={30} height={30} />
						</div>
						<div className={Styles.chatSection}>
							<div className={Styles.msgsDisplay} ref={msgsDisplayDiv}>
								{
									chatMsgs.map((chatMsg) => <div className={Styles.chatMsg} style={{ left: chatMsg.type == "receiver" ? "0" : "auto", right: chatMsg.type == "sender" ? "0" : "auto" }}>
										<div className={Styles.msgBox} style={{ justifyContent: chatMsg.type == "receiver" ? "flex-start" : "flex-end" }}>
											<div ref={messagesEndRef} className={Styles.msgContent} style={{backgroundColor: chatMsg.type == "receiver" ? "#3A3A3C" : "#409CFF", borderRadius: chatMsg.type == "receiver" ? "0 5px 5px 5px" : "5px 5px 0 5px"}}>
												{chatMsg.msgContent}
											</div>
										</div>
									</div>)
								}
							</div>
							<div className={Styles.msgInput}>
								<input type="text" placeholder="message"  value={enteredMsg} onChange={(e) => setEnteredMsg(e.target.value)} onKeyDown={(event) => setMsg(enteredMsg, event, setChatMsgs, chatMsgs, setEnteredMsg)} />
								<Image src={Console} width={23} height={23} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Chat;
