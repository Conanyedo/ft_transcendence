import Styles from "styles/Chat/MessagesList.module.css";
import { conversations, MsgData } from "@Types/dataTypes";
import { InviteMsg } from "./inviteMsg";
import { Dispatch, useState, useEffect, useRef } from "react";
import { ChatMessageInput } from "./ChatMessageInput";

// interface Props {setMsg : Dispatch<MsgData>}

const Message: React.FC<MsgData> = ({
  fullName,
  avatar,
  sender,
  gameInvite,
  content,
  date,
}) => {
  const [inviteMsgAction, setinviteMsgAction] = useState<string>("");

  const MsgInvitStatus = `${
    inviteMsgAction === "Canceled"
      ? "Invitation has been canceled"
      : inviteMsgAction === "Accepted"
      ? "Invitation has been accepted"
      : inviteMsgAction === "Refused"
      ? "Invitation has been refused"
      : !sender
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
      {!gameInvite ? (
        <div className={!sender ? Styles.right : Styles.left}>
          <div className={Styles.MsgContainer}>
            <div
              className={`${Styles.MsgBox} ${sender && Styles.SenderMsgBox}`}
            >
              {/* <h2> Channel Sender Name</h2> */}
              <p>{content}</p>
            </div>
            <div
              className={`${Styles.MsgDate} ${sender && Styles.SenderMsgDate}`}
            >
              {date}
            </div>
          </div>
        </div>
      ) : (
        <div className={!sender ? Styles.right : Styles.left}>
          <div className={Styles.MsgContainer}>
            <div
              className={`${Styles.InviteMsgBox} && ${
                sender && Styles.SenderInviteMsgBox
              }`}
            >
              <div className={Styles.InviteMsginfo}>
                <img
                  src={avatar}
                  alt="UserAvatar"
                ></img>
                <div className={Styles.InviteMsgProfile}>
                  <div>
                    <div className={Styles.InviteMsgProfileName}>
                      {fullName}
                    </div>
                    <div className={Styles.InviteMsgStatus}>
                      {MsgInvitStatus}
                    </div>
                  </div>
                </div>
              </div>
              {!sender && !inviteMsgAction ? (
                <div
                  className={Styles.InviteMsgButton}
                  onClick={CancelInviteHandler}
                >
                  Cancel invitation
                </div>
              ) : !inviteMsgAction ? (
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
              className={`${Styles.MsgDate} ${sender && Styles.SenderMsgDate}`}
            >
              {date}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const MessagesList: React.FC<conversations>  = (convData) => {
  const [chatMessages, setchatMessages] = useState<MsgData[]>([]);
  const MessageRef = useRef<null | HTMLDivElement>(null);
  const convid = { convData }
  const setMsg = (enteredMsg: MsgData) => {
    convData.messages.push(enteredMsg);
    setchatMessages(convData.messages);
  };
  // fetch messages

  useEffect(() => {
    // tmp
    setchatMessages(convData.messages);
  }, [convid]);

  useEffect(() => {
    MessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, convData]);

  return (
    <>
      <div className={Styles.ChatMsgList}>
        {chatMessages.map((msg) => {
          return <Message key={msg.id} {...msg} />;
        })}
        <div ref={MessageRef} />
      </div>
      <ChatMessageInput
        type={convData.type}
        relation={convData.relation}
      />
    </>
  );
};
