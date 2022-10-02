import Styles from "@styles/chat.module.css"
import { useState, useEffect, useContext } from "react";
import { ChatContext, ChatContextType, ChatProvider } from "@contexts/chatContext"
import { useRouter } from 'next/router';
import { getLoginInfo } from "@hooks/useFetchData";
import { ChatRight } from "@components/Chat/chatRight";
import { ChatLeft } from "@components/Chat/chatLeft";
import { getLastConvs } from "@utils/chat";

const Chat = () => {

	// Setting local state
	const [showSetModal, setShowSetModal] = useState(false);
	// const [membersMdl, showMembersMdl] = useState(false);

	const { showCnv, setShowCnv, lastUsers, setLastUsers, setInitialUsrData } = useContext(ChatContext) as ChatContextType;

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

