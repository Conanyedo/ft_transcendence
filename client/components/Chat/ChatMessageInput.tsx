import Styles from "@styles/Chat/ChatMessageInput.module.css";
import SendMsgIcon from "@public/Chat/send-arrow.svg";
import InviteGameIcon from "@public/Chat/Gamepad.svg";
import { useState } from "react";
import { string } from "yup";

export const ChatMessageInput = (props: { type: string; relation: string }) => {
  const [EnteredMsg, setEnteredMsg] = useState<string>("");

  const inputStatus: string =
    props.relation === "Left"
      ? "You left this channel"
      : props.relation === "Blocked"
      ? "You blocked this user"
      : props.relation === "Banned"
      ? "You have been banned from this channel"
      : props.relation === "Muted"
      ? "You have been muted from this channel"
      : "";

  return (
    <>
      {!inputStatus ? (
        <div className={Styles.ChatMsgSendBoxContainer}>
          <div className={Styles.ChatMsgSendBox}>
            <input
              type={"text"}
              placeholder="Message"
              value={EnteredMsg}
              onChange={(e) => setEnteredMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  console.log("Enter key is pressed");
                }
              }}
            ></input>
            {props.type === "DM" ? (
              <img src={InviteGameIcon.src} alt="InviteGameIcon"></img>
            ) : null}
          </div>
          {EnteredMsg.length > 0 ? (
            <img
              src={SendMsgIcon.src}
              alt="SendMsgIcon"
              onClick={(e) => {
                if (EnteredMsg.length > 1) console.log("send mssg");
              }}
            ></img>
          ) : null}
        </div>
      ) : (
        <div className={Styles.ChatMsgSendBoxContainer}>
          <div className={Styles.ChatBlockedSendBox}>{inputStatus}</div>
        </div>
      )}
    </>
  );
};
