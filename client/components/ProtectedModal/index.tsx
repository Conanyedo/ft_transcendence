import Styles from "@styles/chat.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import Cross from "@public/Cross.svg";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "@components/Modal";
import { useRouter } from "next/router";
import { JoinChannel } from "@hooks/useFetchData";
import classes from "../../styles/Search.module.css";
import { useOutsideAlerter } from "@hooks/Functions";

export const ProtectedFormMdl: React.FC<{
  convId: string;
  setShow: Dispatch<SetStateAction<boolean>>;
	refresh: any
}> = ({ convId, setShow, refresh }) => {
  const [inputVal, setInputVal] = useState("");
  const [isMounted, setisMounted] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const mdlRef = useRef<any>();

  const closePopup = async () => {
    setShow(false);
  };

  const handleChange = (e: any) => {
    setInputVal(e.target.value);
  };

  const Submit = async (e: any) => {
    if (inputVal == "") {
      setError("Please enter the password!");
    } else if (!RegExp(
        /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/
      ).test(inputVal)) {
        setError("Wrong Password!");
    }
    else {
      let data = { password: inputVal, convId: convId };
      const res: boolean = await JoinChannel(
        () => null,
        router,
        data,
        setError
      );
			if (res) {
				await refresh();
				setShow(false);
			}
    }
  };
	useEffect(() => {
		setisMounted(true);
	}, [])
	useOutsideAlerter(mdlRef, setShow);
  return (
    <>
      {isMounted && (
				<div className={classes.BackGroundPassword}>
        <div ref={mdlRef} >
          <motion.div
            className={Styles.modalbox}
            animate={{ scale: 1 }}
            initial={{ scale: 0.5 }}
          >
            <div>
              <h1 className={Styles.createChnl}>Password</h1>
              <div onClick={closePopup}>
                <Image
                  src={Cross}
                  width={10}
                  height={10}
                />
              </div>
            </div>
            {error !== "" && <p className={Styles.errorMsg}>{error}</p>}
            <form className={Styles.form} onSubmit={(e: any) => {
              e.preventDefault();
              Submit(e);
            }}>
              <input
                type="password"
                onChange={handleChange}
                className={Styles.usrsInpt}
              />
              <Button clickHandler={Submit} text="Join" />
            </form>
          </motion.div>
        </div></div>
      )}
    </>
  );
};
