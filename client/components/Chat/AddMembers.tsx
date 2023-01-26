import Styles from "@styles/Chat/AddMembers.module.css";
import { InsertChannelMembers } from "./InserChannelMembers";
import CloseIcon from "@public/Cross.svg";
import { Dispatch, SetStateAction, useReducer, useRef } from "react";
import { motion } from "framer-motion";
import { fetchAddChnlMembers } from "@hooks/useFetchData";
import { useOutsideAlerter } from "@hooks/Functions";

interface Props {
  setShowAddMember: Dispatch<SetStateAction<boolean>>;
  setIsSuccess:  Dispatch<SetStateAction<boolean>>;
  convId?: string;
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "members":
      return { ...state, members: action.members };
  }
};

export const AddMembers : React.FC<Props> = ({setShowAddMember, setIsSuccess, convId}) => {
  const [state, dispatch] = useReducer(reducer, []);
  const refOption = useRef(null);

  const closeAddMemberHandler = () => {
    setShowAddMember(false);
  };

  const addMemberclickHandler = async () => {
    console.log("add member : ", state.members);
    if (convId){
      if( await fetchAddChnlMembers(state.members, convId)){
        console.log("aded member : ", state.members);
        setIsSuccess(true);
        setShowAddMember(false);
    }
    }
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
          <InsertChannelMembers state={state} dispatch={dispatch} />
          <div className={Styles.AddMemberBtn} onClick={addMemberclickHandler}>
            Add
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
