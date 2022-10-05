import { chatUser, EmtyUser, UserTypeNew } from "@Types/dataTypes";
import Styles from "@styles/chat.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchDATA } from "@hooks/useFetchData";
import Router from "next/router";
import { getImageBySize } from "@hooks/Functions";
import socket_game from "config/socketGameConfig";
import socket_notif from "config/socketNotif";

export function InviteMsg(props: { senderLogin: string; GameID: string }) {
  const [userInfo, setuserInfo] = useState<UserTypeNew>(EmtyUser);
  const me = localStorage.getItem("owner");

  const acceptHandler = async () => {
    socket_game.emit(
      "joinGameFriend",
      { login: me, accept: props.GameID },
      (data: string) => {
        if (data.length > 4) {
          Router.push("/game/lobby?gameID=" + data);
        }
      }
    );
  };

  const refuseHandler = async () => {
    socket_game.emit("refuseChallenge", props.GameID);
  };
  const cancelHandler = () => {
    socket_game.emit("removeGameLobby", props.GameID);
  };
  useEffect(() => {
    fetchDATA(setuserInfo, Router, "user/info/" + props.senderLogin);
  }, []);

  const pathAvatar = getImageBySize(userInfo?.avatar, 70);
  if (props.senderLogin == me)
    return (
      <div className={Styles.inviteMsg}>
        <div>
          <div className={Styles.inviteCont}>
            <img
              src={pathAvatar}
              width={38}
              height={38}
              className={Styles.inviteAvatar}
            />
            <div className={Styles.inviteUsr}>
              {userInfo?.fullname}
              <p>You invite them to play pong game</p>
            </div>
          </div>
          <button className={Styles.inviteBtn} onClick={cancelHandler}>
            Cancel Invitation
          </button>
        </div>
      </div>
    );
  return (
    <div className={`${Styles.inviteMsg} ${Styles.receivedInvit}`}>
      <div>
        <div className={Styles.inviteCont}>
          <div className={Styles.inviteCont}>
            <img
              src={pathAvatar}
              width={38}
              height={38}
              className={Styles.inviteAvatar}
            />
          </div>
          <div className={Styles.inviteTxt}>
            {userInfo?.fullname}
            <p>Invites you to play pong game</p>
          </div>
        </div>
        <div className={Styles.inviteBtns}>
          <button onClick={refuseHandler} className={Styles.refuseBtn}>
            Refuse
          </button>
          <button onClick={acceptHandler} className={Styles.acceptBtn}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
