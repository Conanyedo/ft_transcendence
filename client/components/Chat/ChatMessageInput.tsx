import Styles from "@styles/Chat/ChatMessageInput.module.css";
import SendMsgIcon from "@public/Chat/send-arrow.svg";
import InviteGameIcon from "@public/Chat/Gamepad.svg";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { conversations, MsgData } from "@Types/dataTypes";
import socket_notif from "config/socketNotif";

interface sendMsg {
  convId?: string;
  receiver?: string;
  login?: string;
  msg: string;
}

interface Props {
  convData: conversations;
  setChatMessages: Dispatch<SetStateAction<MsgData[]>>;
}

export const ChatMessageInput: React.FC<Props> = ({
  convData,
  setChatMessages,
}) => {
  const [EnteredMsg, setEnteredMsg] = useState<string>("");
  const [sendMsg, setSendMsg] = useState<sendMsg | undefined>(undefined);

  // send message

  const inputStatus: string =
    convData.status === "Left"
      ? "You left this channel"
      : convData.status === "Blocker"
      ? "You blocked this user"
      : convData.status === "Banned"
      ? "You have been banned from this channel"
      : convData.status === "Muted"
      ? "You have been muted from this channel"
      : "";

  const inputOnChangeHandler = (event: any) => {
    setEnteredMsg(event.target.value);

    // sendMsgHandler();
  };

  const sendMsgHandler = () => {
    if (EnteredMsg.length > 0) {
      setSendMsg({
        convId: convData.convId,
        receiver: convData.login,
        login: convData.login,
        msg: EnteredMsg,
      });
    }
  };

  const inputonKeyHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (EnteredMsg.length > 0)
        setSendMsg({
          convId: convData.convId,
          receiver: convData.login,
          login: convData.login,
          msg: EnteredMsg,
        });
    }
  };

  // send msg

  useEffect(() => {
    if (EnteredMsg.length > 0) {
      socket_notif.emit("sendMsg", sendMsg, (response: any) => {
        console.log("emit message");
        setEnteredMsg("");
      });
    }
    return () => {
      socket_notif.off("sendMsg");
    };
  }, [sendMsg]);

  return (
    <>
      {!inputStatus ? (
        <div className={Styles.ChatMsgSendBoxContainer}>
          <div className={Styles.ChatMsgSendBox}>
            <input
              type={"text"}
              placeholder="Message"
              onChange={inputOnChangeHandler}
              onKeyDown={inputonKeyHandler}
              value={EnteredMsg}
            ></input>
            {convData.type === "Dm" ? (
              <img src={InviteGameIcon.src} alt="InviteGameIcon"></img>
            ) : null}
          </div>
          {EnteredMsg.length > 0 ? (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
            >
              <img
                src={SendMsgIcon.src}
                alt="SendMsgIcon"
                onClick={sendMsgHandler}
              />
            </motion.div>
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
