import Styles from "@styles/Chat/ChatMessages.module.css";
import ChatMsgSetting from "@public/Chat/ThreeDots.svg";
import Backarrow from "@public/ArrowLeft.svg";
import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessagesList } from "./MessagesList";
import { ChatChnlProfile } from "./ChatChnlProfile";
import { SettingOption } from "./SettingOption";
import { conversations, MsgData } from "@Types/dataTypes";
import { useRouter } from "next/router";
import { CreateChannel } from "./CreateChannel";

interface MsgInfoProps {
  convData: conversations;
  showChnlProfile: boolean;
  setShowChnlProfile: Dispatch<SetStateAction<boolean>>;
  setShowUpdateChannel: Dispatch<SetStateAction<boolean>>;
}

const ChatMsgInfo: React.FC<MsgInfoProps> = ({
  convData,
  showChnlProfile,
  setShowChnlProfile,
  setShowUpdateChannel,
}) => {
  const [showConvSettings, setShowConvSettings] = useState<boolean>(false);
  const router = useRouter();
  const settingsOptClickHandler = () => {
    setShowUpdateChannel(true);
    setShowConvSettings(false);
  };

  const blockOptClickHandler = () => {
    console.log("block : ", convData.login);
    setShowConvSettings(false);
  };

  const unblockOptClickHandler = () => {
    console.log("Unblock : ", convData.login);
    setShowConvSettings(false);
  };

  const leaveChnlOptClickHandler = () => {
    console.log("leave : ", convData.name);
    setShowConvSettings(false);
  };

  const chatMsgProfileClickHandler = () => {
    if (convData.type === "Dm")
      router.push(`/profile/${convData.login}`);
    else if (!showChnlProfile) setShowChnlProfile(true);
  };

  const backArrowHandleClick = () => {
    if (showChnlProfile) setShowChnlProfile(false);
    else router.push({ pathname: "/chat" });
  };

  return (
    <>
      <div className={Styles.ChatMsginfoContainer}>
        <img
          src={Backarrow.src}
          style={showChnlProfile ? { display: "inline" } : {}}
          onClick={backArrowHandleClick}
        ></img>
        <div className={Styles.ChatMsginfo}>
          <div
            className={Styles.ChatMsgProfile}
            onClick={chatMsgProfileClickHandler}
          >
            <img src={convData.avatar}></img>
            <div>
              <div className={Styles.ChatMsgProfileName}>
                {convData.name}
              </div>
              <div className={Styles.ChatMsgProfileStatus}>
                {convData.type === "Dm"
                  ? convData.status
                  : `${convData.membersNum} Members`}
              </div>
            </div>
          </div>

          <div className={Styles.ChatMsgSettings}>
            <img
              src={ChatMsgSetting.src}
              alt="ChatMsgSetting"
              onClick={(e) => setShowConvSettings(!showConvSettings)}
            ></img>
            {showConvSettings && (
              <motion.div
                className={Styles.SettingContainer}
                initial={{
                  opacity: 0,
                  scale: 0.1,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
              >
                {convData.status === "Owner" ||
                convData.status === "Admin" ? (
                  <SettingOption
                    name={"Settings"}
                    optionClickHandler={settingsOptClickHandler}
                  />
                ) : null}
                {convData.type === "Dm" ? (
                  convData.status === "Blocker" ? (
                    <SettingOption
                      name={"Unblock user"}
                      optionClickHandler={unblockOptClickHandler}
                    />
                    ) : (
                    <SettingOption
                      name={"Block user"}
                      optionClickHandler={blockOptClickHandler}
                    />
                  )
                ) : (
                  <SettingOption
                    name={"Leave channel"}
                    optionClickHandler={leaveChnlOptClickHandler}
                  />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

interface Props {
  isMobile: boolean;
  convData: conversations;
  updateConversations : (msgConvId : string) => void;
}

export const ChatMessages: React.FC<Props> = ({
  isMobile,
  convData,
  updateConversations
}) => {
  const [showChnlProfile, setShowChnlProfile] = useState<boolean>(false);
  const [showUpdateChannel, setShowUpdateChannel] = useState<boolean>(false);

  const CloseChannelHandler = () => {
    setShowUpdateChannel(false);
  };

  useLayoutEffect(() => {
    if (showChnlProfile) setShowChnlProfile(false);
  }, [convData.convId]);

  return (
    <>
      {showUpdateChannel ? (
        <CreateChannel
          isUpdate={true}
          initialChnlState={{avatar : convData.avatar, name : convData.name, type : convData.type}}
          CloseChannelHandler={CloseChannelHandler}
        />
      ) : null}
      {convData.convId !== "0" ? (
        <div
          className={Styles.ChatMessagesContainer}
          style={
            isMobile
              ? convData.convId !== "0"
                ? { width: "100%" }
                : { width: "0" }
              : {}
          }
        >
          <ChatMsgInfo
            convData={convData}
            showChnlProfile={showChnlProfile}
            setShowChnlProfile={setShowChnlProfile}
            setShowUpdateChannel={setShowUpdateChannel}
          />
          {showChnlProfile ? (
            <ChatChnlProfile {...convData} />
          ) : (
            <MessagesList convData={convData}  updateConversations={updateConversations}/>
          )}
        </div>
      ) : !isMobile ? (
        <div
          className={`${Styles.ChatMessagesContainer} ${Styles.StartNewCnv}`}
        >
          Start New Conversation
        </div>
      ) : null}
    </>
  );
};
