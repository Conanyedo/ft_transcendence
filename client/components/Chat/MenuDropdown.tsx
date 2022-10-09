// import { useOutsideAlerter } from "@hooks/Functions";
import { ChatContext, ChatContextType } from "@contexts/chatContext";
import { useOutsideAlerter } from "@hooks/Functions";
import { leaveChannel } from "@hooks/useFetchData";
import Styles from "@styles/chat.module.css";
import { BlockFriend, UnblockFriend } from "@utils/chat";
import Router from "next/router";
import { useContext, useEffect, useRef, useState } from "react";

export const MenuDropdown = (props: { data: any; methods: any }) => {
  const menuRef = useRef<any>(null);

  const [content, setContent] = useState<any>([]);
  const [functions, setFunctions] = useState<any>([]);
  const { setShowCnv } = useContext(ChatContext) as ChatContextType;

  // set conditions here
  useEffect(() => {
    if (
      props.data.currentUser.type == "Dm" &&
      props.data.relation != "Blocker"
    ) {
      setContent([, "Block User"]);
      setFunctions([
        ,
        () => BlockFriend(props.data.currentUser, props.methods.setRelation),
      ]);
    } else if (
      props.data.currentUser.type == "Dm" &&
      props.data.relation == "Blocker"
    ) {
      setContent([, "Unblock User"]);
      setFunctions([
        ,
        () => UnblockFriend(props.data.currentUser, props.methods.setRelation),
      ]);
    } else {
      if (
        props.data.currentUser.relation === "Admin" ||
        props.data.currentUser.relation === "Owner"
      ) {
        setContent(["Update Channel", "Leave Channel"]);
        setFunctions([
          () => props.methods.setModal(true),
          () => leaveChannel(props.data.currentUser.convId, Router, setShowCnv),
        ]);
      } else {
        setContent(["Leave Channel"]);
        setFunctions([
          () => leaveChannel(props.data.currentUser.convId, Router, setShowCnv),
        ]);
      }
    }
  }, []);
  useOutsideAlerter(menuRef, props.methods.setDropdwn);
  return (
    <>
      {props.data.dropdwn && (
        <div className={Styles.menuDropdown} ref={menuRef}>
          {content.map((element: any, i: any) => (
            <div
              key={i}
              onClick={functions[i]}
              className={[1, 2].includes(i) ? Styles.redText : ""}
            >
              {element}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
