import Styles from "@styles/chat.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import Cross from "@public/Cross.svg";
import { useFormik } from "formik";
import { Button, UsersModalInput } from "@components/Modal/index";
import { useEffect, useRef, useState } from "react";
import {
  SuggestedUsr,
  addUsrToChannel,
  filterOutUsers,
} from "@components/Modal/utils";
import { addMembers, getFriends } from "@hooks/useFetchData";
import { useOutsideAlerter } from "@hooks/Functions";

// const Input = (props: {
//   title: string;
//   handleChange: any;
//   value: any;
//   name: string;
// }) => {
//   return (
//     <div className={`${Styles.inputContainer}`}>
//       <span>{props.title}</span>
//       <input
//         name={props.name}
//         type="text"
//         className={Styles.usrsInpt}
//         onChange={props.handleChange}
//         value={props.value}
//       />
//     </div>
//   );
// };

export const MembersModal = (props: {
  refresh: any;
  showSetModal: any;
  currentUser: any;
  setShowSetModal: any;
}) => {
  const [initialUsrState, setInitialUsrState] = useState([]);
  const [showDrpdown, setshowDrpdown] = useState(false);

  // new logic
  const [friends, setFriends] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [status, setStatus] = useState();
  const [isMounted, setisMounted] = useState(false);

  const inputRef = useRef("");

  const formik = useFormik({
    initialValues: {
      member: "",
    },
    onSubmit: (values) => {
    },
  });

  const handleOnChange = (event: any) => {
    let value = event.target.value;
    formik.setFieldValue("member", value);
    // Filter values here
    filterOutUsers(value, friends, setshowDrpdown);
  };

  // get list of friends on the first render
  const setUsrs = async () => {
    return await getFriends(setFriends);
  };

  useEffect(() => {
    setUsrs();
		setisMounted(true);
  }, []);

  useEffect(() => {
    setUsrs();
  }, [status])

  const addMember = async () => {
    formik.setFieldValue("member", "");
    let logins = addedUsers?.map((user: any) => user.login);
    const data = { convId: props.currentUser.convId, members: logins };
    await addMembers(data, setStatus);
    setAddedUsers([]);
    props.refresh();
  };

  const clickHandler = (user: any) => {
    addUsrToChannel(
      user,
      setAddedUsers,
      setshowDrpdown,
      addedUsers,
      inputRef,
      setFriends,
      friends
    );
    formik.setFieldValue("member", "");
  };

  useEffect(() => {
  }, [friends]);

  function CloseMdl() {
    props.setShowSetModal(false);
  }

  const modalRef = useRef<any>("");

  // useOutsideAlerter here
  useOutsideAlerter(modalRef, props.setShowSetModal);
  const value = inputRef?.current as React.InputHTMLAttributes<HTMLInputElement>;
  return (
    <>
      {isMounted && props.showSetModal && (
        <>
          <div
            style={{ display: props.showSetModal ? "block" : "none" }}
            className={Styles.grayBg}
          >
            &nbsp;
          </div>
          <div ref={modalRef}>
            <motion.div
              className={Styles.modalbox}
              animate={{ scale: 1 }}
              initial={{ scale: 0.5 }}
            >
              <div>
                <h1 className={Styles.createChnl}>Add Members</h1>
                <div>
                  <Image
                    src={Cross}
                    width={10}
                    height={10}
                    onClick={CloseMdl}
                  />
                </div>
              </div>
              <form className={Styles.form} onSubmit={formik.handleSubmit}>
                <UsersModalInput
                  addedUsers={addedUsers}
                  setAddedUsers={setAddedUsers}
                  handleChange={handleOnChange}
                  value={formik.values.member}
                  inputRef={inputRef}
                  oldUsers={friends}
                  setOldUsers={setFriends}
                />
                {showDrpdown && (
                  <div className={Styles.dropMembers}>
                    {friends.map((usr: any, i) => {
                      if (
                        usr?.fullname
                          ?.toLowerCase()
                          .includes(value?.value)
                      )
                        return (
                          <SuggestedUsr
                            key={i}
                            user={usr}
                            action={clickHandler}
                          />
                        );
                    })}
                  </div>
                )}
                <Button clickHandler={addMember} text="Add" />
              </form>
            </motion.div>
          </div>
        </>
      )}
    </>
  );
};
