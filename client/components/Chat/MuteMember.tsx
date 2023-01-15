import Styles from "@styles/Chat/MuteMember.module.css";
import CloseIcon from "@public/Cross.svg";
import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";

interface Props {
  setShowMuteMember: Dispatch<SetStateAction<boolean>>;
}

export const MuteMember: React.FC<Props> = ({ setShowMuteMember }) => {
  const closeMuteMember = () => {
    setShowMuteMember(false);
  };

  const formSubmitHandler = (event : any) => {
    event.preventDefault();
    console.log("submit mute member");

  }

  return (
    <>
      <motion.div
        className={Styles.MuteMemberBackground}
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
          <form className={Styles.MuteMemberContainer} onSubmit={(e) => formSubmitHandler(e)}>
            <div className={Styles.MuteMemberHeader}>
              <div> Mute Member</div>
              <img src={CloseIcon.src} onClick={closeMuteMember} />
            </div>
            <p className={Styles.MuteMemberDescription}>
              The member won’t be able to send and receive any message from the
              channel
            </p>
            <div className={Styles.MuteMemberOptionsContainer}>
              <div className={Styles.MuteMemberOption}>
                1 Hour
                <input
                  type={"radio"}
                  name="muteMemberOption"
                  id="1 Hour"
                  value="1 Hour"
                  defaultChecked
                ></input>
                <label htmlFor="1 Hour"></label>
              </div>
              <div className={Styles.MuteMemberOption}>
                8 Hours
                <input
                  type={"radio"}
                  name="muteMemberOption"
                  id="8 Hours"
                  value="8 Hours"
                ></input>
                <label htmlFor="8 Hours"></label>
              </div>
              <div className={Styles.MuteMemberOption}>
                12 Hours
                <input
                  type={"radio"}
                  name="muteMemberOption"
                  id="12 Hours"
                  value="12 Hour"
                ></input>
                <label htmlFor="12 Hours"></label>
              </div>
              <div className={Styles.MuteMemberOption}>
                24 Hours
                <input
                  type={"radio"}
                  name="muteMemberOption"
                  id="24 Hours"
                  value="24Hour"
                ></input>
                <label htmlFor="24 Hours"></label>
              </div>
              <div className={Styles.MuteMemberOption}>
                7 Days
                <input
                  type={"radio"}
                  name="muteMemberOption"
                  id="7 Days"
                  value="7 Days"
                ></input>
                <label htmlFor="7 Days"></label>
              </div>
            </div>
            <input type="submit" value="Mute" />
          </form>
        </motion.div>
      </motion.div>
    </>
  );
};
