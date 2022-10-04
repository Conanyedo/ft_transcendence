import Styles from "@styles/chat.module.css";
import { useState, useEffect, useContext } from "react";
import {
  ChatContext,
  ChatContextType,
  ChatProvider,
} from "@contexts/chatContext";
import { useRouter } from "next/router";
import { getLoginInfo } from "@hooks/useFetchData";
import { ChatRight } from "@components/Chat/chatRight";
import { ChatLeft } from "@components/Chat/chatLeft";
import { getLastConvs } from "@utils/chat";
import LoadingElm from "@components/loading/Loading_elm";
import { ProtectedFormMdl } from "@components/ProtectedModal";

class channelDataType {
  type: string;
  convId: string;
  constructor() {
    this.type = "";
    this.convId = "";
  }
}

const Chat = () => {
  // Setting local state
  const [showSetModal, setShowSetModal] = useState(false);
  const [channelData, setChannelData] = useState<channelDataType>(
    new channelDataType()
  );

  const { showCnv, setShowCnv, lastUsers, setLastUsers, setInitialUsrData } =
    useContext(ChatContext) as ChatContextType;

  const router = useRouter();
  const [login, setLogin] = useState<any>("");
  const { loginPath, channelPath } = router.query;

  useEffect(() => {
    //upon entering execute this
    if (router.isReady) {
      // get login info first
      if (loginPath != undefined) getLoginInfo(loginPath, true, setChannelData);
      else if (channelPath != undefined)
        getLoginInfo(channelPath, false, setChannelData);

      setLogin(login || channelPath);
      setShowCnv(true);
    }
  }, [router]);

  if (channelData.type == "" && channelPath)
  	return <LoadingElm />


    return (
      <ChatProvider>
        <div className={Styles.chatContainer}>
          <ChatLeft login={login} />
          {channelData.type === '' && <ChatRight setShowSetModal={setShowSetModal} login={login} />}
          {channelData.type !== '' && <ProtectedFormMdl convId={channelData.convId} />}
        </div>
      </ChatProvider>
    );
};
export default Chat;
