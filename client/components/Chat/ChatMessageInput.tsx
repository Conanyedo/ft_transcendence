import Styles from "@styles/Chat/ChatMessageInput.module.css";
import SendMsgIcon from "@public/Chat/send-arrow.svg";
import InviteGameIcon from "@public/Chat/Gamepad.svg";
import React, { useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import { conversations, MsgData } from "@Types/dataTypes";
import socket_notif from "config/socketNotif";
import { useDispatch } from "react-redux";
import socket_game from "config/socketGameConfig";
import { ShowErrorGameMsg } from "@store/UI-Slice";
import SettingGame from "@components/game/settingGame";
import { useRouter } from "next/router";

// interface sendMsg {
//   convId?: string;
//   receiver?: string;
//   login?: string;
//   msg: string;
// }
interface Props {
  convData: conversations;
}

export const ChatMessageInput: React.FC<Props> = ({ convData }) => {
  const [EnteredMsg, setEnteredMsg] = useState<string>("");
  const [settingGames, ShowSettingGames] = useState(false);
  const dispatch = useDispatch();
  const me = localStorage.getItem("owner");
  const router = useRouter();

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
  };

  const sendMsg = () => {
    if (EnteredMsg.length > 0) {
      socket_notif.emit(
        "sendMsg",
        {
          convId: convData.convId,
          receiver: convData.login,
          login: convData.login,
          msg: EnteredMsg,
        },
        (response: any) => {
          setEnteredMsg("");
        }
      );
    }
  };

  const inputonKeyHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (EnteredMsg.length > 0) sendMsg();
    }
  };

  const sendInvitGame = () => {
    console.log(convData);
    socket_game.emit(
      "checkLobby",
      { admin: me, login: convData.login },
      (data: boolean) => {
        if (!data) {
          ShowSettingGames(true);
        } else {
          dispatch(ShowErrorGameMsg());
        }
      }
    );
  };

  function sendGame(gameID: string) {
    let data = {
      sender: me,
      invitation: gameID,
      convId: convData.convId,
      receiver: convData.login,
    };
    socket_notif.emit("sendMsg", data, (response: any) => {});
    ShowSettingGames(false);
  }

  const HideSetting = () => {
    ShowSettingGames(false);
  };

  useLayoutEffect(() => {
    setEnteredMsg("");
  }, [router.query]);

  return (
    <>
      {settingGames && (
        <SettingGame
          sendGame={sendGame}
          login={convData?.login}
          Hide={HideSetting}
        />
      )}
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
              <img
                src={InviteGameIcon.src}
                alt="InviteGameIcon"
                onClick={sendInvitGame}
              ></img>
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
              <img src={SendMsgIcon.src} alt="SendMsgIcon" onClick={sendMsg} />
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
