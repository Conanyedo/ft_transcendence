import Styles from "@styles/chat.module.css"
import { useState, useEffect } from "react";
import { ChatProvider } from "@contexts/chatContext"
import ContentWrapper from "@components/wrapper/appWrapper";
import { ChatLeft, ChatRight } from "@components/Chat";
import { useRouter } from 'next/router';

const Chat = () => {

	// Setting local state
	const [showSetModal, setShowSetModal] = useState(false);
	// const [membersMdl, showMembersMdl] = useState(false);

    const router = useRouter()
	const [uid, setUID] = useState(0);

	useEffect(() => {
		//upon entering execute this
		if (router.isReady) {
			const { id } = router.query;
			setUID(parseInt(id as string));
		}
	}, [router])

	return (
		<ContentWrapper children={
			<ChatProvider>
				<div className={Styles.chatContainer}>
					<ChatLeft />
					<ChatRight setShowSetModal={setShowSetModal} uid={uid} />
				</div>
			</ChatProvider>
		}
		/>
	);
};
export default Chat;
