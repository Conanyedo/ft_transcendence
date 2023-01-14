import Styles from "@styles/Chat/AddMembers.module.css";
import { InsertChannelMembers } from "./InserChannelMembers";
import CloseIcon from "@public/Cross.svg";

export const AddMembers = () => {
  const closeAddMemberHandler = () => {
    console.log("close add member");
  };

  const addMemberclickHandler = () => {
    console.log("add member");
  };

  return (
    <>
      <div className={Styles.AddMemberContainer}>
        <div className={Styles.AddMemberHeader}>
          Add Member
          <img src={CloseIcon.src} onClick={closeAddMemberHandler}></img>
        </div>
        <InsertChannelMembers />
        <div className={Styles.AddMemberBtn} onClick={addMemberclickHandler}>
          Add
        </div>
      </div>
    </>
  );
};
