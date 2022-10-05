import { EmtyUser, UserTypeNew } from "@Types/dataTypes";
import Styles from "@styles/chat.module.css";
import { useEffect, useState } from "react";
import { fetchDATA } from "@hooks/useFetchData";
import Router from "next/router";
import { getImageBySize } from "@hooks/Functions";
import socket_game from "config/socketGameConfig";
import socket_notif from "config/socketNotif";

export function InviteMsg(props: {chatMsg: any}) {
  const [userInfo, setuserInfo] = useState<UserTypeNew>(EmtyUser);
  const [msgData, setmsgData] = useState<any>();
  const me = localStorage.getItem("owner");
  useEffect(() => {
    setmsgData(props.chatMsg);
  }, [props.chatMsg])
  
  const acceptHandler = async () => {
    socket_game.emit(
      "joinGameFriend",
      { login: me, accept: msgData?.invitation },
      (data: string) => {
        if (data.length > 4) {
          socket_notif.emit('updateInvitation', {convId: msgData?.convId, msgId: msgData?.msgId, status: 'Accepted' }, (res: any) => {
            setmsgData(res.data);
          })
          Router.push("/game/lobby?gameID=" + data);
        }
      }
    );
  };
  const refuseHandler = async () => {
    socket_game.emit("refuseChallenge", msgData?.invitation);
    socket_notif.emit('updateInvitation', {convId: msgData?.convId, msgId: msgData?.msgId, status: 'Refused' }, (res: any) => {
      setmsgData(res.data);
    })
  };
  const cancelHandler = () => {
    socket_game.emit("removeGameLobby", msgData?.invitation);
    socket_notif.emit('updateInvitation', {convId: msgData?.convId, msgId: msgData?.msgId, status: 'Canceled' }, (res: any) => {
      setmsgData(res.data);
    })
  };
  useEffect(() => {
    if (msgData?.sender !== '')
      fetchDATA(setuserInfo, Router, "user/info/" + msgData?.sender);
  }, [msgData?.sender]);
  
  const pathAvatar = getImageBySize(userInfo?.avatar, 70);
  console.log(msgData);
  if (msgData?.sender == me)
    return (
      <div className={Styles.inviteMsg}>
        <div className={Styles.inviteCont}>
          <img
            src={pathAvatar}
            width={38}
            height={38}
            className={Styles.inviteAvatar}
          />
          <div className={Styles.inviteUsr}>
            {userInfo?.fullname}
            {msgData?.status === 'Sent' && <p>You invited them to play pong game</p>}
            {msgData?.status === 'Canceled' && <p>the invitation has been canceled</p>}
            {msgData?.status === 'Refused' && <p>the invitation has been Refused</p>}
            {msgData?.status === 'Accepted' && <p>the invitation has been Accepted</p>}
          </div>
        </div>
        {msgData?.status === 'Sent' && <button className={Styles.inviteBtn} onClick={cancelHandler}>
          Cancel Invitation
        </button>}
      </div>
    );
  return (
    <div className={`${Styles.inviteMsg} ${Styles.receivedInvit}`}>
      <div>
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
            {msgData?.status === 'Sent' && <p>You invited them to play pong game</p>}
            {msgData?.status === 'Canceled' && <p>the invitation has been canceled</p>}
            {msgData?.status === 'Refused' && <p>You refused the invitation</p>}
            {msgData?.status === 'Accepted' && <p>You accepted the invitation</p>}
        </div>
      </div>
      {msgData?.status === 'Sent' && <div className={Styles.inviteBtns}>
        <button className={Styles.inviteBtn} onClick={acceptHandler}>
          Accept
        </button>
        <button className={Styles.inviteBtn} onClick={refuseHandler}>
          Refuse
        </button>
      </div>}
    </div>
  );
}
