import { useState } from "react";
import Styles from "../../styles/Chat/Conversation.module.css";

export const Conversation = (props: any) => {
  return (
    <div className={`${Styles.ConversationContainer} ${props.selected ? Styles.selected : ""}`} onClick={props.onClick}>
      <div className={Styles.Convinfo}>
        <img src={props.avatar}></img>
        <span>{props.fullName}</span>
      </div>
      <div className={Styles.ConvStatus}>
        {props.membersNum > 0 ? `${props.membersNum} Members` : props.status}
        {!props.read && <div className={Styles.NewMsg}></div>}
      </div>
    </div>
  );
};
