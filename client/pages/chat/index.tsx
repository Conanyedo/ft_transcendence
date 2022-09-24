import Styles from "@styles/chat.module.css"
import { useState, useEffect, useContext } from "react";
import { ChatContext, ChatContextType, ChatProvider } from "@contexts/chatContext"
import ContentWrapper from "@components/wrapper/appWrapper";
import { ChatLeft, ChatRight } from "@components/Chat";
import { useRouter } from 'next/router';
import { getLoginInfo } from "@hooks/useFetchData";

const Chat = () => {

	// Setting local state
	const [showSetModal, setShowSetModal] = useState(false);
	// const [membersMdl, showMembersMdl] = useState(false);

	const { showCnv, setShowCnv, lastUsers } = useContext(ChatContext) as ChatContextType;

    const router = useRouter();
	const [login, setLogin] = useState<any>("");

	useEffect(() => {
		//upon entering execute this
		if (router.isReady) {
			const { login } = router.query;

			// get login info first
			getLoginInfo(login);
			setLogin(login);
			setShowCnv(true);
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
