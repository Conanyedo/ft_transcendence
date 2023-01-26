import Styles from "@styles/Chat/ChatMessages.module.css";
import ChatMsgSetting from "@public/Chat/ThreeDots.svg";
import Backarrow from "@public/ArrowLeft.svg";
import React, {
  Dispatch,
  SetStateAction,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { MessagesList } from "./MessagesList";
import { ChatChnlProfile } from "./ChatChnlProfile";
import { SettingOption } from "./SettingOption";
import { conversations } from "@Types/dataTypes";
import { useRouter } from "next/router";
import { CreateChannel } from "./CreateChannel";
import { getImageBySize, useOutsideAlerter } from "@hooks/Functions";
import { fetchBlockUnblockUser, fetchLeaveChannel } from "@hooks/useFetchData";

interface MsgInfoProps {
  convData: conversations;
  showChnlProfile: boolean;
  updateConversations: (ConvId: string) => void;
  setShowChnlProfile: Dispatch<SetStateAction<boolean>>;
  setShowUpdateChannel: Dispatch<SetStateAction<boolean>>;
}

const ChatMsgInfo: React.FC<MsgInfoProps> = ({
  convData,
  showChnlProfile,
  setShowChnlProfile,
  setShowUpdateChannel,
  updateConversations,
}) => {
  const [showConvSettings, setShowConvSettings] = useState<boolean>(false);
  const router = useRouter();
  const avatar = getImageBySize(convData.avatar, 70);
  const refOption = useRef(null);

  const settingsOptClickHandler = () => {
    setShowUpdateChannel(true);
    setShowConvSettings(false);
  };

  const blockOptClickHandler = async () => {
    if (convData.convId) {
      console.log("block : ", convData.login);
      if (await fetchBlockUnblockUser(convData.login, "friendship/blockUser")) {
        console.log("blocked : ", convData.login);
        updateConversations(convData.convId);
        setShowConvSettings(false);
      }
    }
  };

  const unblockOptClickHandler = async () => {
    if (convData.convId) {
      console.log("unblock : ", convData.login);
      if (await fetchBlockUnblockUser(convData.login, "friendship/unblock")) {
        console.log("unblocked : ", convData.login);
        updateConversations(convData.convId);
        setShowConvSettings(false);
      }
    }
  };

  const leaveChnlOptClickHandler = async () => {
    if (convData.convId)
      if (await fetchLeaveChannel(convData.convId)) {
        updateConversations(convData.convId);
        setShowConvSettings(false);
      }
  };

  const chatMsgProfileClickHandler = () => {
    if (convData.type === "Dm") router.push(`/profile/${convData.login}`);
    else if (!showChnlProfile) setShowChnlProfile(true);
  };

  const backArrowHandleClick = () => {
    if (showChnlProfile) setShowChnlProfile(false);
    else router.push({ pathname: "/chat" });
  };

  const closeOptions = (v: boolean) => {
    setShowConvSettings(v);
  };

  useOutsideAlerter(refOption, closeOptions);

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
            <img src={avatar}></img>
            <div>
              <div className={Styles.ChatMsgProfileName}>{convData.name}</div>
              <div className={Styles.ChatMsgProfileStatus}>
                {convData.type !== "Dm"
                  ? `${convData.membersNum} Members`
                  : convData.status !== "Blocker" && convData.status}
              </div>
            </div>
          </div>

          <div className={Styles.ChatMsgSettings} ref={refOption}>
            {convData.status !== "Left" && (
              <img
                src={ChatMsgSetting.src}
                alt="ChatMsgSetting"
                onClick={(e) => setShowConvSettings(!showConvSettings)}
              />
            )}
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
                {convData.status === "Owner" || convData.status === "Admin" ? (
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
  updateConversations: (msgConvId: string) => void;
}

const ChatMessages: React.FC<Props> = ({
  isMobile,
  convData,
  updateConversations,
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
      {showUpdateChannel && (
        <CreateChannel
          isUpdate={true}
          convId={convData.convId}
          initialChnlState={{
            avatar: convData.avatar,
            name: convData.name,
            type: convData.type,
            password: "",
          }}
          updateConversations={updateConversations}
          CloseChannelHandler={CloseChannelHandler}
        />
      )}
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
            updateConversations={updateConversations}
          />
          {showChnlProfile ? (
            <ChatChnlProfile {...convData} />
          ) : (
            <MessagesList
              convData={convData}
              updateConversations={updateConversations}
            />
          )}
        </div>
      ) : (
        !isMobile && (
          <div
            className={`${Styles.ChatMessagesContainer} ${Styles.StartNewCnv}`}
          >
            Start New Conversation
          </div>
        )
      )}
    </>
  );
};

////// ......... //////////

export default React.memo(ChatMessages);
