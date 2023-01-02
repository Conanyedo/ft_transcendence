import Styles from "styles/Chat/Message.module.css";
import { MsgData } from "./ChatMessages";
import { InviteMsg } from "./inviteMsg";
import { Dispatch, useState } from "react";

interface Props {setMsg : Dispatch<MsgData>}

export const Message = ({ fullName,  Sender, GameInvite, Content, Date }: MsgData) => {
  const [inviteMsgAction, setinviteMsgAction] = useState<string>("");

  const MsgInvitStatus = `${
    inviteMsgAction === "Canceled"
    ? "Invitation has been canceled"
    : inviteMsgAction === "Accepted"
    ? "Invitation has been accepted"
    : inviteMsgAction === "Refused"
    ? "Invitation has been refused"
    : !Sender
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
      {!GameInvite ? (
        <div className={!Sender ? Styles.right : Styles.left}>
          <div className={Styles.MsgContainer}>
            <div
              className={`${Styles.MsgBox} ${Sender && Styles.SenderMsgBox}`}
            >
              {/* <h2> Channel Sender Name</h2> */}
              <p>{Content}</p>
            </div>
            <div
              className={`${Styles.MsgDate} ${Sender && Styles.SenderMsgDate}`}
            >
              {Date}
            </div>
          </div>
        </div>
      ) : (
        <div className={!Sender ? Styles.right : Styles.left}>
          <div className={Styles.MsgContainer}>
            <div
              className={`${Styles.InviteMsgBox} && ${
                Sender && Styles.SenderInviteMsgBox
              }`}
            >
              <div className={Styles.InviteMsginfo}>
                <img
                  src="https://pm1.narvii.com/6551/6a77c032610cade5d9dd5eac9f6a576bbe99438a_128.jpg"
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
              {!Sender && !inviteMsgAction ? (
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
              className={`${Styles.MsgDate} ${Sender && Styles.SenderMsgDate}`}
            >
              {Date}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
