import Styles from "@styles/Chat/AddMembers.module.css";
import { InsertChannelMembers } from "./InserChannelMembers";
import CloseIcon from "@public/Cross.svg";
import { Dispatch, SetStateAction, useReducer, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fetchAddChnlMembers } from "@hooks/useFetchData";
import { useOutsideAlerter } from "@hooks/Functions";
import { member } from "@Types/dataTypes";

interface Props {
  setShowAddMember: Dispatch<SetStateAction<boolean>>;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  convId?: string;
  chnlMembers: string[];
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "members":
      return { ...state, members: action.members };
  }
};

export const AddMembers: React.FC<Props> = ({
  setShowAddMember,
  setIsSuccess,
  convId,
  chnlMembers,
}) => {
  const [state, dispatch] = useReducer(reducer, []);
  const [addMemberError, setAddMemberError] = useState<string>("");
  const refOption = useRef(null);

  const closeAddMemberHandler = () => {
    setShowAddMember(false);
  };

  const addMemberclickHandler = async () => {
    if (convId && state.members.length > 0) {
      if (await fetchAddChnlMembers(state.members, convId)) {
        setIsSuccess(true);
        setShowAddMember(false);
      }
    } else setAddMemberError("Invalid (add at least 1 member)");
  };

  const closeOptions = (v: boolean) => {
    setShowAddMember(v);
  };

  useOutsideAlerter(refOption, closeOptions);

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
          ref={refOption}
        >
          <div className={Styles.AddMemberHeader}>
            Add Member
            <img src={CloseIcon.src} onClick={closeAddMemberHandler}></img>
          </div>
          <InsertChannelMembers
            state={state}
            dispatch={dispatch}
            chnlMembers={chnlMembers}
          />
          {addMemberError.length > 0 && <p>{addMemberError}</p>}
          <div className={Styles.AddMemberBtn} onClick={addMemberclickHandler}>
            Add
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
