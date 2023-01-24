import Styles from "@styles/Chat/MuteMember.module.css";
import CloseIcon from "@public/Cross.svg";
import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { member } from "@Types/dataTypes";
import { fetchMuteMember } from "@hooks/useFetchData";

const durations: { [key: string]: number } = {
  "10 Seconds": 10,
  "1 Hour": 3600,
  "8 Hours": 8 * 3600,
  "12 Hours": 12 * 3600,
  "24 Hours": 24 * 3600,
  "7 Days": 7 * 24 * 3600,
  "1 Month": 30 * 24 * 3600,
};
interface Props {
  setShowMuteMember: Dispatch<SetStateAction<boolean>>;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  convId?: string;
  member: member;
}

export const MuteMember: React.FC<Props> = ({
  setShowMuteMember,
  setIsSuccess,
  convId,
  member,
}) => {
  const closeMuteMember = () => {
    setShowMuteMember(false);
  };

  const formSubmitHandler = async (event: any) => {
    event.preventDefault();
    const duration = durations[event.target.muteMemberOption.value];
    if (
      await fetchMuteMember({
        member: member.login,
        duration: duration,
      }, convId)
    ) {
      setIsSuccess(true);
      closeMuteMember();
    }
  };

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
          <form
            className={Styles.MuteMemberContainer}
            onSubmit={(e) => formSubmitHandler(e)}
          >
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
                10 Seconds
                <input
                  type={"radio"}
                  name="muteMemberOption"
                  id="10 Seconds"
                  value="10 Seconds"
                  defaultChecked
                ></input>
                <label htmlFor="10 Seconds"></label>
              </div>
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
