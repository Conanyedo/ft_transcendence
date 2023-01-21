import Styles from "styles/Chat/MessagesList.module.css";
import { conversations, MsgData } from "@Types/dataTypes";
import { InviteMsg } from "./inviteMsg";
import { Dispatch, useState, useEffect, useRef, useLayoutEffect } from "react";
import { ChatMessageInput } from "./ChatMessageInput";
import socket_notif from "config/socketNotif";

const formatAMPM = (date: Date) => {
  let hours = new Date(date).getHours();
  let minutes: number | string = new Date(date).getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours %= 12;
  hours = hours || 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
};
interface MsgProps {
  avatar?: string;
  msg: string;
  sender: string;
  fullname?: string;
  invitation?: string;
  status: string;
  date: Date;
  convId?: string;
  msgId?: string;
  type: string;
}

const Message: React.FC<MsgProps> = ({
  avatar,
  msg,
  sender,
  fullname,
  invitation,
  status,
  type,
  date,
}) => {
  const [inviteMsgAction, setinviteMsgAction] = useState<string>(status);
  const msgTime = formatAMPM(date);
  const logedInUsr = localStorage.getItem("owner");
  const MsgInvitStatus = `${
    inviteMsgAction === "Canceled"
      ? "Invitation has been canceled"
      : inviteMsgAction === "Accepted"
      ? "Invitation has been accepted"
      : inviteMsgAction === "Refused"
      ? "Invitation has been refused"
      : sender === logedInUsr
      ? "You invite him to play pong game"
      : "Invites you to play pong game"
  }`;

  const CancelInviteHandler = () => {
    console.log("game invitation canceled");
    setinviteMsgAction("Canceled");
  };

  const AcceptInviteHandler = () => {
    console.log("game invitation Accepted");
    setinviteMsgAction("Accepted");
  };

  const RefuseInviteHandler = () => {
    console.log("game invitation Refused");
    setinviteMsgAction("Refused");
  };

  return (
    <>
      {!invitation ? (
        <div className={sender === logedInUsr ? Styles.right : Styles.left}>
          <div className={Styles.MsgContainer}>
            <div
              className={`${Styles.MsgBox} ${
                sender !== logedInUsr && Styles.SenderMsgBox
              }`}
            >
              {type !== "Dm" && sender !== logedInUsr ? (
                <h2>{fullname}</h2>
              ) : null}
              <p>{msg}</p>
            </div>
            <div
              className={`${Styles.MsgDate} ${
                sender !== logedInUsr && Styles.SenderMsgDate
              }`}
            >
              {msgTime}
            </div>
          </div>
        </div>
      ) : (
        <div className={sender === logedInUsr ? Styles.right : Styles.left}>
          <div className={Styles.MsgContainer}>
            <div
              className={`${Styles.InviteMsgBox} && ${
                sender !== logedInUsr && Styles.SenderInviteMsgBox
              }`}
            >
              <div className={Styles.InviteMsginfo}>
                <img src={avatar} alt="UserAvatar"></img>
                <div className={Styles.InviteMsgProfile}>
                  <div>
                    <div className={Styles.InviteMsgProfileName}>
                      {fullname}
                    </div>
                    <div className={Styles.InviteMsgStatus}>
                      {MsgInvitStatus}
                    </div>
                  </div>
                </div>
              </div>
              {sender === logedInUsr && inviteMsgAction === "Sent" ? (
                <div
                  className={Styles.InviteMsgButton}
                  onClick={CancelInviteHandler}
                >
                  Cancel invitation
                </div>
              ) : inviteMsgAction === "Sent" ? (
                <div className={Styles.SenderInviteMsgButton}>
                  <div
                    className={Styles.RefuseInvite}
                    onClick={RefuseInviteHandler}
                  >
                    Refuse
                  </div>
                  <div
                    className={Styles.AcceptInvite}
                    onClick={AcceptInviteHandler}
                  >
                    Accept
                  </div>
                </div>
              ) : null}
            </div>
            <div
              className={`${Styles.MsgDate} ${
                sender !== logedInUsr && Styles.SenderMsgDate
              }`}
            >
              {msgTime}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface MsglistProps {
  convData : conversations;
  updateConversations : (msgConvId : string) => void;
}

export const MessagesList: React.FC<MsglistProps> = ({convData, updateConversations}) => {
  const [chatMessages, setChatMessages] = useState<MsgData[]>([]);
  const MessageRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    socket_notif.emit(
      "getMsgs",
      { convId: convData.convId },
      (response: any) => {
        setChatMessages(response.data);
      }
    );
  }, [convData.convId]);

  /* -------------------------------------------------------------------------- */
  /*            listen on new msg while been on the same conversation           */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    socket_notif.on("newMsg", (response : any) => {
      {
        if (response.data.convId === convData.convId)
        {
          setChatMessages((previous) => [...previous, response.data]);
        }
        updateConversations(response.data.convId);
      }
    });
    return () => {
      socket_notif.off("newMsg");
    };
  }, [convData]);

  useEffect(() => {
    MessageRef.current?.scrollIntoView();
  }, [chatMessages, convData]);

  return (
    <>
      <div className={Styles.ChatMsgList}>
        {chatMessages.map((msg) => {
          return (
            <Message
              key={msg.msgId}
              {...msg}
              avatar={msg.invitation ? convData.avatar : undefined}
              type={convData.type}
            />
          );
        })}
        <div ref={MessageRef} />
      </div>
      <ChatMessageInput convData={convData} setChatMessages={setChatMessages} />
    </>
  );
};
