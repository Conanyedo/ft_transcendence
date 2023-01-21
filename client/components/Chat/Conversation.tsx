import { Dispatch, SetStateAction, useState } from "react";
import { ConsoleView } from "react-device-detect";
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
  setSelectedConv: Dispatch<SetStateAction<string | string[]>>;
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
  setSelectedConv,
}) => {
  const convClickHandler = () => {
    if (convId) setSelectedConv(convId);
  };

  return (
    <div
      className={`${Styles.ConversationContainer} ${
        selected ? Styles.selected : ""
      }`}
      onClick={convClickHandler}
    >
      <div className={Styles.Convinfo}>
        <img src={avatar}></img>
        <span>{name}</span>
      </div>
      <div className={Styles.ConvStatus}>
        {type !== "Dm" ? `${membersNum} Members` : status}
        {unread ? <div className={Styles.NewMsg}></div> : null}
      </div>
    </div>
  );
};
