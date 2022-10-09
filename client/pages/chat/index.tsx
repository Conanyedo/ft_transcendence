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
  const [show, setShow] = useState(false);
  const [channelData, setChannelData] = useState<channelDataType>(
    new channelDataType()
  );

  const [selectedConv, setSelectedConv] = useState<string>();

  const { showCnv, setShowCnv, lastUsers, setLastUsers, setInitialUsrData } =
    useContext(ChatContext) as ChatContextType;

  const router = useRouter();
  const [name, setName] = useState<any>("");
  const [channelName, setchannelName] = useState<any>("");
  const [isUp, setisUp] = useState<boolean>(false);
  const { login, channel } = router.query;

  const refresh = async () => {
    if (router.isReady) {
      // get login info first
      if (channel != undefined) {
        setchannelName(channel);
        await getLoginInfo(channel, false, setChannelData);
      }
      if (login === undefined) setShowCnv(false);

      setName(login || channel);
    }
  };

  useEffect(() => {
    //upon entering execute this
    if (
      RegExp(
        /^(?=.{2,20}$)(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/
      ).test((login || channel) as string)
    ) {
      refresh();
    }
  }, [login, channel]);

  if (channelData.type !== "" && channelData.type !== "Public" && !show) {
    setShow(true);
  } else if (
    (channelData.type === "" || channelData.type == "Public") &&
    show
  ) {
    setShow(false);
  }

  const closePopup = () => {
    setChannelData(new channelDataType());
    setShow(false);
  };

  useEffect(() => {
    setisUp(true);
  }, []);

  return (
    <>
      {isUp && (
        <ChatProvider>
          <div className={Styles.chatContainer}>
            <ChatLeft
              login={name}
              selectedConv={selectedConv}
              setSelectedConv={setSelectedConv}
            />
            {
              <ChatRight
                setShowSetModal={setShowSetModal}
                setSelectedConv={setSelectedConv}
                login={
                  channelData.type !== "" && channelData.type !== "Public"
                    ? undefined
                    : name
                }
              />
            }{" "}
            {show}
            {/* <ProtectedFormMdl
              convId={channelData.convId}
              show={show}
              setShow={closePopup}
              refresh={refresh}
              name={channelName}
            /> */}
          </div>
        </ChatProvider>
      )}
    </>
  );
};
export default Chat;
