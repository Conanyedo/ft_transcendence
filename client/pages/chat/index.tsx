import Styles from "@styles/chat.module.css"
import { useState, useEffect } from "react";
import { ChatProvider } from "@contexts/chatContext"
import ContentWrapper from "@components/wrapper/appWrapper";
import { ChatLeft, ChatRight } from "@components/Chat";
import { useRouter } from 'next/router';

// importing socket io
import socket_notif from "config/socketNotif";

const Chat = () => {

	// Setting local state
	const [showSetModal, setShowSetModal] = useState(false);
	const [cnvs, setCnvs] = useState([]);
	// const [membersMdl, showMembersMdl] = useState(false);

    const router = useRouter()
	const [uid, setUID] = useState(0);

	useEffect(() => {
		//upon entering execute this
		if (router.isReady) {
			const { id } = router.query;
			setUID(parseInt(id as string));
		}

		socket_notif.on("connect", () => {
			console.log(socket_notif.connected);
			socket_notif.emit("getConversations",[], (response:any) => {
				console.log(response);
				setCnvs(response);
			})
		})
		
	}, [router])

	return (
		<ContentWrapper children={
			<ChatProvider>
				<div className={Styles.chatContainer}>
					<ChatLeft cnvs={cnvs} />
					<ChatRight setShowSetModal={setShowSetModal} uid={uid} />
				</div>
			</ChatProvider>
		}
		/>
	);
};
export default Chat;
