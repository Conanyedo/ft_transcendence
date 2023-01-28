import Styles from "@styles/Chat/ProtectedChnlForm.module.css";
import { JoinChannel } from "@hooks/useFetchData";
import CloseIcon from "@public/Cross.svg";
import React, { useState } from "react";
import { validPassword } from "./CreateChannel";
import { motion } from "framer-motion";

export const ProtectedChnlForm: React.FC<{ convId: string }> = ({ convId }) => {
  const [enteredPasswd, setEnteredPasswd] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  const inputOnchangeHandler = (event: any) => {
    setEnteredPasswd(event.target.value);
  };

  const formOnsubmithandler = async (event: any) => {
    event.preventDefault();
    if (validPassword.test(enteredPasswd)) {
      let data = { password: enteredPasswd, convId: convId };
      const res: boolean = await JoinChannel(data, setFormError);
      if (!res) setFormError("Wrong password!");
    } else
      setFormError(
        "Password must contain at least 8 characters, At least one number, one uppercase letter and one special character"
      );
  };

  return (
    <>
      <motion.div
        className={Styles.ProtectedFormBackground}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.1,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
        >
          <form
            className={Styles.ProtectedFormContainer}
            onSubmit={formOnsubmithandler}
          >
            <div className={Styles.ProtectedFormHeader}>
              Add Member
              <img src={CloseIcon.src}></img>
            </div>
            <input
              type={"password"}
              value={enteredPasswd}
              onChange={inputOnchangeHandler}
            />
            {formError.length > 0 && (
              <p className={Styles.FormError}>{formError}</p>
            )}
            <input type="submit" value={"Join"} />
          </form>
        </motion.div>
      </motion.div>
    </>
  );
};
