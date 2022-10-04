import { useOutsideAlerter } from "@hooks/Functions";
import Styles from "@styles/chat.module.css";
import { useRef, useState } from "react";

export const MenuDropdown = (props: {
  content: Array<any>;
  functions: Array<any>;
  id: string;
  dropdwn: any,
  setDropdown: any,
  menuRef: any
}) => {

  useOutsideAlerter(props.menuRef, props.setDropdown);
  return (
    <>
      {props.dropdwn && (
        <div className={Styles.menuDropdown} id={props.id} ref={props.menuRef} style={{ display: "none"}}>
          {props.content.map((element, i) => (
            <div
              key={i}
              onClick={props.functions[i]}
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
