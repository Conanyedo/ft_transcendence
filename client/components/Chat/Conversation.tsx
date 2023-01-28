import { getImageBySize } from "@hooks/Functions";
import socket_notif from "config/socketNotif";
import { useRouter } from "next/router";
import { useLayoutEffect, useState } from "react";
import Styles from "../../styles/Chat/Conversation.module.css";

interface Props {
  convId?: string;
  avatar: string;
  name: string;
  membersNum?: number;
  status: string;
  unread: number;
  type: string;
  selected: boolean;
}

export const Conversation: React.FC<Props> = ({
  convId,
  avatar,
  name,
  membersNum,
  status,
  unread,
  type,
  selected,
}) => {
  const router = useRouter();
  const [unRead, setUnRead] = useState<number>(unread);
  const convClickHandler = () => {
    socket_notif.emit(
      "setMsgsAsRead",
      { convId: convId },
      (response: any) => {}
    );
    if (convId && type === "Dm") router.push("/chat?login=" + convId);
    else router.push("/chat?channel=" + convId);
  };

  useLayoutEffect(() => {
    setUnRead(unread);
  }, [unread]);

  useLayoutEffect(() => {
    if (convId === router.query.login || convId === router.query.channel)
      setUnRead(0);
  }, [router.query]);
  
  return (
    <div
      className={`${Styles.ConversationContainer} ${
        selected ? Styles.selected : ""
      }`}
      onClick={convClickHandler}
    >
      <div className={Styles.Convinfo}>
        <img src={getImageBySize(avatar, 70)}></img>
        <div className={Styles.ConvStatus}>
          <div className={Styles.userName}>{name}</div>
          {type !== "Dm"
            ? status !== "Left" && `${membersNum} Members`
            : status !== "Blocker" && status}
        </div>
      </div>
      {unRead > 0 ? <div className={Styles.NewMsg}>{unRead}</div> : null}
    </div>
  );
};
