import Styles from "@styles/chat.module.css"
import { useState, useEffect, useContext } from "react";
import { ChatContext, ChatContextType, ChatProvider } from "@contexts/chatContext"
import ContentWrapper from "@components/wrapper/appWrapper";
import { ChatLeft, ChatRight } from "@components/Chat";
import { useRouter } from 'next/router';

const Chat = () => {

	// Setting local state
	const [showSetModal, setShowSetModal] = useState(false);
	// const [membersMdl, showMembersMdl] = useState(false);

    const router = useRouter();
	const [login, setLogin] = useState<any>("");

	useEffect(() => {
		//upon entering execute this
		if (router.isReady) {
			const { login } = router.query;
			setLogin(login);
		}
		
	}, [router])

	return (
			<ChatProvider>
				<div className={Styles.chatContainer}>
					<ChatLeft login={login} />
					<ChatRight setShowSetModal={setShowSetModal} login={login} />
				</div>
			</ChatProvider>
	);
};
export default Chat;
