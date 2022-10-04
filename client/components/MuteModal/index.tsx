import { motion } from "framer-motion";
import { useRef } from "react";
import Styles from "styles/chat.module.css";
import Image from "next/image";
import Cross from "@public/Cross.svg";
import { Button } from "@components/Modal";

const CheckBox: React.FC<{}> = ({}) => {
  return (
    <div className={Styles.checkCont}>
    <label className={Styles.checkboxCont}>
        <input
          type="radio"
          checked={true}
          name="radio"
          className={Styles.radioInput}
        />
      <span className={Styles.checkmark}></span>
    </label>
    </div>
  );
};

const TimeForm: React.FC<{}> = ({}) => {
  const times = [
    "1 Hours",
    "8 Hours",
    "12 Hours",
    "24 Hours",
    "7 Days",
    "1 Month",
  ];

  const seconds = [];
  return (
    <>
      <div className={Styles.inputContainer}></div>
      <div className={`${Styles.flexSpace}`}>
        {times.map((time) => {
          return (
            <>
              <div className={`${Styles.topSection}`}>
                <div>
                  <span>{time}</span>
                </div>
                <CheckBox />
              </div>
            </>
          );
        })}
      </div>
      <Button clickHandler={() => null} text="Mute" />
    </>
  );
};

export const MuteModal: React.FC<{
  show: boolean;
  setShow: any;
}> = ({ show, setShow }) => {
  setShow(true);

  const modalRef = useRef<any>("");
  return (
    <>
      <div
        style={{ display: show ? "block" : "none" }}
        className={Styles.grayBg}
      >
        &nbsp;
      </div>
      <motion.div
        ref={modalRef}
        className={Styles.modalbox}
        animate={{ scale: 1 }}
        initial={{ scale: 0.5 }}
      >
        <div>
          <h1 className={Styles.createChnl}>Mute Member</h1>
          <div>
            <Image
              src={Cross}
              width={10}
              height={10}
              onClick={() => setShow(!show)}
            />
          </div>
        </div>
        <p className={Styles.whiteText}>
          The member won’t be able to send and receive any message from the
          channel
        </p>
        <TimeForm />
      </motion.div>
    </>
  );
};
