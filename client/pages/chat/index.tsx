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
  const [name, setName] = useState<any>("");
  const { login, channel } = router.query;

  useEffect(() => {
    //upon entering execute this
    if (router.isReady) {
      // get login info first
      if (channel != undefined)
        getLoginInfo(channel, false, setChannelData);

      setName(login || channel);
      setShowCnv(true);
    }
  }, [login, channel]);

  // if (channelData.type == "" && channel){
    
  // 	return <LoadingElm />
  // }
  
    console.log('channelData :' , name);

    return (
      <ChatProvider>
        <div className={Styles.chatContainer}>
          <ChatLeft login={name} />
          {<ChatRight setShowSetModal={setShowSetModal} login={channelData.type !== '' && channelData.type !== 'Public'  ? undefined : name} />}
          {channelData.type !== '' && channelData.type !== 'Public' && <ProtectedFormMdl convId={channelData.convId} />}
        </div>
      </ChatProvider>
    );
};
export default Chat;
