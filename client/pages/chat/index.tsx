import Styles from "@styles/chat.module.css"
import Image from "next/image"
import Avatar from "@public/profile.jpg";
import { useState, useRef, useEffect, useContext } from "react";
import { scrollToBottom } from "@utils/chat";
import { chatUser, chatMsg } from "@Types/dataTypes";
import { ChatProvider, ChatContext, ChatContextType } from "@contexts/chatContext"
import ContentWrapper from "@components/wrapper/appWrapper";
import { MembersModal } from "@components/MembersModal";
import { ChatLeft, ChatRight, InviteMsg } from "@components/Chat"


const Chat = () => {

	// Setting local state
	const [showSetModal, setShowSetModal] = useState(false);


	// 	// Filter out results
	// 	
	// }

	// // UseEffect here
	// useEffect(() => {
	// 	scrollToBottom(messagesEndRef);
	// 	setCurrentUser(lastUsers[0]);
	// }, [lastUsers])

	return (
		<ContentWrapper children={
			<ChatProvider>
				<MembersModal showSetModal={showSetModal} setShowSetModal={setShowSetModal} />
				<div className={Styles.chatContainer}>
					<ChatLeft />
					<ChatRight setShowSetModal={setShowSetModal}  />
				</div>
			</ChatProvider>
		}
		/>
	);
};
export default Chat;
