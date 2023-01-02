import Styles from "@styles/Chat/ChatMessages.module.css";
import ChatMsgSetting from "@public/Chat/ThreeDots.svg";
import Backarrow from "@public/ArrowLeft.svg";
import AddMembericon from "@public/Chat/AddMemberIcon.svg";
import { ChatMessageInput } from "./ChatMessageInput";
import { Message } from "./Message";
import { ChannelMember } from "./ChannelMember";
import { useEffect, useRef, useState } from "react";

export interface MsgData {
  fullName: string;
  Sender: boolean;
  GameInvite: boolean;
  Content: string;
  Date: string;
}

const Messages: MsgData[] = [
  {
    fullName: "Choaib Abouelwafa",
    Sender: true,
    GameInvite: false,
    Content:
      "hellooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
    Date: "7:00",
  },
  {
    fullName: "Choaib Abouelwafa",
    Sender: true,
    GameInvite: false,
    Content: "how r u",
    Date: "7:00",
  },
  {
    fullName: "Abdellah belhachmi",
    Sender: false,
    GameInvite: false,
    Content: "hey wassup",
    Date: "7:00",
  },
  {
    fullName: "Abdellah belhachmi",
    Sender: false,
    GameInvite: false,
    Content: "im good u?",
    Date: "7:00",
  },
  {
    fullName: "Choaib Abouelwafa",
    Sender: true,
    GameInvite: false,
    Content: "im fine thanks",
    Date: "7:00",
  },
  {
    fullName: "Choaib Abouelwafa",
    Sender: false,
    GameInvite: true,
    Content: "",
    Date: "7:00",
  },
  {
    fullName: "Choaib Abouelwafa",
    Sender: true,
    GameInvite: true,
    Content: "",
    Date: "7:00",
  },
  {
    fullName: "Choaib Abouelwafa",
    Sender: true,
    GameInvite: true,
    Content: "",
    Date: "7:00",
  },
  {
    fullName: "Choaib Abouelwafa",
    Sender: true,
    GameInvite: true,
    Content: "",
    Date: "7:00",
  },
  {
    fullName: "Choaib Abouelwafa",
    Sender: true,
    GameInvite: true,
    Content: "",
    Date: "7:00",
  },
  {
    fullName: "Choaib Abouelwafa",
    Sender: true,
    GameInvite: true,
    Content: "",
    Date: "7:00",
  },
  {
    fullName: "Choaib Abouelwafa",
    Sender: true,
    GameInvite: true,
    Content: "",
    Date: "7:00",
  },
];
export const ChatMessages = () => {
  const [ChatMessages, setChatMessages] = useState(Messages);
  const MessageRef = useRef<null | HTMLDivElement>(null);

  const setMsg = (enteredMsg: MsgData) => {
    Messages.push(enteredMsg);
    setChatMessages(Messages);
  };

  useEffect(() => {
    MessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, ChatMessages);

  const BackarrowHandleClick = () => {
    console.log("Back to Chat root");
  };

  const ChatMsgProfileHandleClick = () => {
    console.log("Go to User profile");
  };

  const AddMemberClickHandler = () => {
    console.log("Add Member clicked");
  };

  return (
    <>
      <div className={Styles.ChatMessagesContainer}>
        <div className={Styles.ChatMsginfoContainer}>
          <img src={Backarrow.src} onClick={BackarrowHandleClick}></img>
          <div className={Styles.ChatMsginfo}>
            <div
              className={Styles.ChatMsgProfile}
              onClick={ChatMsgProfileHandleClick}
            >
              <img src="https://images.saymedia-content.com/.image/c_limit%2Ccs_srgb%2Cq_auto:eco%2Cw_700/MTczOTM5NzMzODQyMzcxNjQ4/guts-a-berserk-character-analysis.webp"></img>
              <div>
                <div className={Styles.ChatMsgProfileName}>
                  Abdellah Belhachmi
                </div>
                <div className={Styles.ChatMsgProfileStatus}>Status</div>
              </div>
            </div>
            <div className={Styles.ChatMsgSettings}>
              <img src={ChatMsgSetting.src} alt="ChatMsgSetting"></img>
            </div>
          </div>
        </div>
        {/* <div className={Styles.ChannelProfile}>
          <div className={Styles.ChannelProfileHeader}>
            Channel Profile
            <div
              className={Styles.AddMemberButton}
              onClick={AddMemberClickHandler}
            >
              <img src={AddMembericon.src} alt="AddMemberIcon"></img>
              <p>Add member</p>
            </div>
          </div>
          <div className={Styles.MemberListContainer}>
            Owner
            <div className={Styles.MemberList}>
              <ChannelMember></ChannelMember>
            </div>
          </div>
          <div className={Styles.MemberListContainer}>
            Admins
            <div className={Styles.MemberList}>
              <ChannelMember></ChannelMember>
              <ChannelMember></ChannelMember>
              <ChannelMember></ChannelMember>
            </div>
          </div>
          <div className={Styles.MemberListContainer}>
            Members
            <div className={Styles.MemberList}>
              <ChannelMember></ChannelMember>
              <ChannelMember></ChannelMember>
              <ChannelMember></ChannelMember>
              <ChannelMember></ChannelMember>
              <ChannelMember></ChannelMember>
              <ChannelMember></ChannelMember>
              <ChannelMember></ChannelMember>
            </div>
          </div>
        </div> */}
        <div className={Styles.ChatMsgList}>
          {Messages.map((data) => {
            return <Message {...data}></Message>;
          })}
          <div ref={MessageRef} />
        </div>
        <ChatMessageInput></ChatMessageInput>
      </div>
    </>
  );
};
