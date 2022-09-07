import Styles from "@styles/chat.module.css"
import Image from "next/image"
import Avatar from "@public/profile.jpg";
import { useState, useRef, useEffect } from "react";
import { scrollToBottom } from "@utils/chat";
import { chatUser, chatMsg } from "@Types/dataTypes";
import { ChatProvider } from "@contexts/chatContext"
import ContentWrapper from "@components/wrapper/appWrapper";
import { MembersModal } from "@components/MembersModal";
import { ChatLeft, ChatRight } from "@components/Chat"

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
				<MembersModal showSetModal={showSetModal} setShowSetModal={setShowSetModal} />
				<div className={Styles.chatContainer}>
					<ChatLeft showCnv={showCnv} displayBlueIcon={displayBlueIcon} setShow={setShow} show={show} setDisplayBlueIcon={setDisplayBlueIcon} createChannel={createChannel} filterChatUsers={filterChatUsers} lastUsers={lastUsers} chatUsersRefs={chatUsersRefs} setChatUser={setChatUser}/>
					<ChatRight showCnv={showCnv} currentUser={currentUser} setShowCnv={setShowCnv} profile={profile} setShowprofile={setShowprofile} showProfile={showProfile} showUsrMenu={showUsrMenu} showMenuDropdown={showMenuDropdown} setShowSetModal={setShowSetModal} chatMsgs={chatMsgs} msgsDisplayDiv={msgsDisplayDiv} messagesEndRef={messagesEndRef} enteredMsg={enteredMsg} setEnteredMsg={setEnteredMsg} sendInvite={sendInvite} setChatMsgs={setChatMsgs} />
				</div>
			</ChatProvider>}
		/>
	);
};
export default Chat;
