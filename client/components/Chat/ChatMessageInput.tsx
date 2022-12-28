import Styles from "@styles/Chat/ChatMessageInput.module.css";
import SendMsgIcon from "@public/Chat/send-arrow.svg";
import InviteGameIcon from "@public/Chat/Gamepad.svg";
import { useState } from "react";
import { string } from "yup";

export const ChatMessageInput = () => {
  const [EnteredMsg, setEnteredMsg] = useState<string>("");

  return (
    <>
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
          <img src={InviteGameIcon.src} alt="InviteGameIcon"></img>
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
    </>
  );
};
