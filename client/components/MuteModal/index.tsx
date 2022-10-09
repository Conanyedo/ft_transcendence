import { motion } from "framer-motion";
import { useRef, useState } from "react";
import Styles from "styles/chat.module.css";
import Image from "next/image";
import Cross from "@public/Cross.svg";
import { Button } from "@components/Modal";
import { muteMemberFromChnl } from "@hooks/useFetchData";
import { useRouter } from "next/router";
import { useOutsideAlerter } from "@hooks/Functions";

const CheckBox: React.FC<{ time: string; set: any }> = ({ time, set }) => {
  const clickHandler = () => {
    set(time);
  };

  return (
    <div className={Styles.checkCont} onClick={clickHandler}>
      <label className={Styles.checkboxCont}>
        <input
          type="radio"
          name="radio"
          className={Styles.radioInput}
          id={time}
        />
        <span className={Styles.checkmark}></span>
      </label>
    </div>
  );
};

const times = [
  "1 Hours",
  "8 Hours",
  "12 Hours",
  "24 Hours",
  "7 Days",
  "1 Month",
];
const seconds = [60, 28800, 43200, 86400, 604800, 2630000];

async function muteMember(
  user: any,
  convId: string,
  router: any,
  time:string,
  setShow: any
) {

  let timing = seconds[times.indexOf(time)];
  if (
    await muteMemberFromChnl({
      convId: convId,
      member: user.login,
      seconds: timing,
    })
  ) {
    setShow();
  }
}

const TimeForm: React.FC<{ user:any, convId: string, setShow: any }> = ({ user, convId, setShow }) => {
  
  const [time, setTime] = useState("1 Hours");

  const router = useRouter();
  return (
    <>
      <div className={Styles.inputContainer}></div>
      <div className={`${Styles.flexSpace}`}>
        {times.map((time, i) => {
          return (
              <div className={`${Styles.topSection}`} key={i}>
                <div>
                  <span>{time}</span>
                </div>
                <CheckBox set={setTime} time={time} />
              </div>
          );
        })}
      </div>
      <Button clickHandler={() => muteMember(user, convId, router, time, setShow)} text="Mute" />
    </>
  );
};

export const MuteModal: React.FC<{
  setShow: any;
  user: any,
  convId: string
}> = ({ setShow, user, convId }) => {

  const modalRef = useRef<any>("");

  useOutsideAlerter(modalRef, setShow);
  return (
    <>
      <div
        style={{ display: "block" }}
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
              onClick={setShow}
            />
          </div>
        </div>
        <p className={Styles.whiteText}>
          The member won’t be able to send and receive any message from the
          channel
        </p>
        <TimeForm user={user} convId={convId} setShow={setShow}/>
      </motion.div>
    </>
  );
};
