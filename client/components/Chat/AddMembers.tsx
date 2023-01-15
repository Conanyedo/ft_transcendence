import Styles from "@styles/Chat/AddMembers.module.css";
import { InsertChannelMembers } from "./InserChannelMembers";
import CloseIcon from "@public/Cross.svg";
import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";

export const AddMembers = (props: {
  setShowAddMember: Dispatch<SetStateAction<boolean>>;
}) => {
  const closeAddMemberHandler = () => {
    console.log("close add member");
    props.setShowAddMember(false);
  };

  const addMemberclickHandler = () => {
    console.log("add member");
  };

  return (
    <>
      <motion.div
        className={Styles.AddMemberBackground}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
      >
        <motion.div
          className={Styles.AddMemberContainer}
          initial={{
            opacity: 0,
            scale: 0.1,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
        >
          <div className={Styles.AddMemberHeader}>
            Add Member
            <img src={CloseIcon.src} onClick={closeAddMemberHandler}></img>
          </div>
          <InsertChannelMembers />
          <div className={Styles.AddMemberBtn} onClick={addMemberclickHandler}>
            Add
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
