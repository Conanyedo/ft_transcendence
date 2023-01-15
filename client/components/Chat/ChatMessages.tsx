import Styles from "@styles/Chat/ChatMessages.module.css";
import ChatMsgSetting from "@public/Chat/ThreeDots.svg";
import Backarrow from "@public/ArrowLeft.svg";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessagesList } from "./MessagesList";
import { ChatChnlProfile } from "./ChatChnlProfile";
import { SettingOption } from "./SettingOption";
import { conversations } from "@Types/dataTypes";
import { NextRouter, useRouter } from "next/router";
import { CreateChannel } from "./CreateChannel";

const ChatMsgInfo: React.FC<any> = (props: {
  convData: conversations;
  logedInUsr: string;
  showChnlProfile: boolean;
  router: NextRouter;
  setShowChnlProfile: Dispatch<SetStateAction<boolean>>;
  setShowUpdateChannel: Dispatch<SetStateAction<boolean>>;
}) => {
  const [showConvSettings, setShowConvSettings] = useState<boolean>(false);

  const settingsOptClickHandler = () => {
    props.setShowUpdateChannel(true);
    setShowConvSettings(false);
  };

  const blockOptClickHandler = () => {
    console.log("block : ", props.convData.login);
    setShowConvSettings(false);
  };

  const unblockOptClickHandler = () => {
    console.log("Unblock : ", props.convData.login);
    setShowConvSettings(false);
  };

  const leaveChnlOptClickHandler = () => {
    console.log("leave : ", props.convData.fullName);
    setShowConvSettings(false);
  };

  const chatMsgProfileClickHandler = () => {
    if (props.convData.type === "DM")
      props.router.push(`/profile/${props.convData.login}`);
    else if (!props.showChnlProfile) props.setShowChnlProfile(true);
  };

  const backArrowHandleClick = () => {
    if (props.showChnlProfile) props.setShowChnlProfile(false);
    else props.router.replace({ pathname: "/chat" });
  };

  return (
    <>
      <div className={Styles.ChatMsginfoContainer}>
        <img
          src={Backarrow.src}
          style={props.showChnlProfile ? { display: "inline" } : {}}
          onClick={backArrowHandleClick}
        ></img>
        <div className={Styles.ChatMsginfo}>
          <div
            className={Styles.ChatMsgProfile}
            onClick={chatMsgProfileClickHandler}
          >
            <img src={props.convData.avatar}></img>
            <div>
              <div className={Styles.ChatMsgProfileName}>
                {props.convData.fullName}
              </div>
              <div className={Styles.ChatMsgProfileStatus}>
                {props.convData.type === "DM"
                  ? props.convData.status
                  : `${props.convData.membersNum} Members`}
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
                {props.convData.relation === "Owner" ||
                props.convData.relation === "Admin" ? (
                  <SettingOption
                    name={"Settings"}
                    optionClickHandler={settingsOptClickHandler}
                  />
                ) : null}
                {props.convData.type === "DM" ? (
                  props.convData.relation === "Friend" ? (
                    <SettingOption
                      name={"Block user"}
                      optionClickHandler={blockOptClickHandler}
                    />
                  ) : (
                    <SettingOption
                      name={"Unblock user"}
                      optionClickHandler={unblockOptClickHandler}
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
  router: NextRouter;
}

export const ChatMessages: React.FC<Props> = ({
  isMobile,
  convData,
  router,
}) => {
  const [showChnlProfile, setShowChnlProfile] = useState<boolean>(false);
  const [showUpdateChannel, setShowUpdateChannel] = useState<boolean>(false);
  const logedInUsr = localStorage.getItem("owner");

  const CloseChannelHandler = () => {
    setShowUpdateChannel(false);
  };

  useEffect(() => {
    if (showChnlProfile) setShowChnlProfile(false);
  }, [convData.convid]);

  return (
    <>
      {showUpdateChannel ? (
        <CreateChannel
          isUpdate={true}
          CloseChannelHandler={CloseChannelHandler}
        />
      ) : null}
      {convData.convid > 0 ? (
        <div
          className={Styles.ChatMessagesContainer}
          style={
            isMobile
              ? convData.convid > 0
                ? { width: "100%" }
                : { width: "0" }
              : {}
          }
        >
          <ChatMsgInfo
            logedInUsr={logedInUsr}
            convData={convData}
            showChnlProfile={showChnlProfile}
            router={router}
            setShowChnlProfile={setShowChnlProfile}
            setShowUpdateChannel={setShowUpdateChannel}
          />
          {showChnlProfile ? (
            <ChatChnlProfile {...convData} />
          ) : (
            <MessagesList {...convData} />
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
