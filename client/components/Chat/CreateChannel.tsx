import Styles from "@styles/Chat/CreateChannel.module.css";
import CloseIcon from "@public/Cross.svg";
import UploadIcon from "../../public/FriendIcons/UploadIcon.svg";
import Eye from "@public/Chat/Eye.svg";
import CloseEye from "@public/Chat/Eye-closed.svg";
import { InsertChannelMembers } from "./InserChannelMembers";
import { SetStateAction, Dispatch, useState } from "react";
import { motion } from "framer-motion";
import { time } from "console";
import { type } from "os";
interface ChannelData {
  avatar?: string;
  channelName: string;
  channelType: string;
  password?: string;
  members: string[];
}

const validPassword = RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
);

export const CreateChannel = (props: {
  isUpdate: boolean;
  CloseChannelHandler: () => void;
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [Chnltype, setChnlType] = useState<string>("Public");
  const [ChnlError, setChnlError] = useState<string[]>(["", ""]);

  const chnltypeDescription: string = `${
    Chnltype === "Public"
      ? "All users can find and join this channel"
      : Chnltype === "Private"
      ? "Only users you invited can join the channel"
      : "All users can find the channel but only those with the provided password can join"
  }`;

  const checkIsValidForm = (event: any) => {
    if (event.target.channelName.value.length < 4)
      setChnlError(["channelName", "invalid Channel Name"]);
    else if (
      Chnltype === "Protected" &&
      !validPassword.test(event.target.channelPassword.value.length)
    )
      setChnlError([
        "channelPassword",
        "invalid Password (minimum 8 characters long)",
      ]);
  };

  const FormSubmitHandler = (event: any) => {
    event.preventDefault();
    checkIsValidForm(event);
  };

  return (
    <>
      <motion.div
        className={Styles.CreateChannelBackground}
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
            className={Styles.CreateChannelContainer}
            onSubmit={(e) => {
              FormSubmitHandler(e);
            }}
          >
            <div className={Styles.CreateChannelHeader}>
              <div>{!props.isUpdate ? "Create Channel" : "Update Channel"}</div>
              <img src={CloseIcon.src} onClick={props.CloseChannelHandler} />
            </div>
            {props.isUpdate && (
              <label className={Styles.ChannelImage} htmlFor="channelImage">
                <img
                  src="https://otsukai.com/public/item/41345/5f3e27993c0ce.png?operation=resize&w=960"
                  alt="channelImage"
                />
                <input
                  type={"file"}
                  id="channelImage"
                  name="channelImage"
                ></input>
                <label className={Styles.Overlay}>
                  <img src={UploadIcon.src} />
                </label>
              </label>
            )}
            <label className={Styles.ChannelTxtInput} htmlFor="channelName">
              Channel Name
              <input type={"text"} name="channelName"></input>
              {ChnlError[0] === "channelName" && (
                <p className={Styles.ChnlError}>{ChnlError[1]}</p>
              )}
            </label>
            <div className={Styles.ChannelType}>
              <span className={Styles.ChnlTypeContainer}>
                Public
                <input
                  type="radio"
                  name="channelType"
                  value="Public"
                  readOnly
                  checked={Chnltype === "Public"}
                />
                <label
                  className={Styles.Switch}
                  htmlFor="Public"
                  onClick={(e) => {
                    setChnlType("Public");
                  }}
                ></label>
              </span>
              <span className={Styles.ChnlTypeContainer}>
                Private
                <input
                  type="radio"
                  name="channelType"
                  value="Private"
                  readOnly
                  checked={Chnltype === "Private"}
                />
                <label
                  className={Styles.Switch}
                  htmlFor="Private"
                  onClick={(e) => {
                    setChnlType("Private");
                  }}
                ></label>
              </span>
              <span className={Styles.ChnlTypeContainer}>
                Protected
                <input
                  type="radio"
                  name="channelType"
                  value="Protected"
                  readOnly
                  checked={Chnltype === "Protected"}
                />
                <label
                  className={Styles.Switch}
                  htmlFor="Protected"
                  onClick={(e) => {
                    setChnlType("Protected");
                  }}
                ></label>
              </span>
            </div>
            <p className={Styles.ChnlTypeDescription}>{chnltypeDescription}</p>
            {Chnltype === "Protected" && (
              <div className={Styles.ChannelTxtInput}>
                Password
                <div className={Styles.ChannelPsswdInput}>
                  <input type={showPassword ? "text" : "password"} name="channelPassword"></input>
                  {!showPassword ? (
                    <img src={Eye.src} onClick={() => setShowPassword(true)} />
                  ) : (
                    <img
                      src={CloseEye.src}
                      onClick={() => setShowPassword(false)}
                    />
                  )}
                </div>
                {ChnlError[0] === "channelPassword" && (
                  <p className={Styles.ChnlError}>{ChnlError[1]}</p>
                )}
              </div>
            )}
            {!props.isUpdate && (
              <div className={Styles.ChannelTxtInput}>
                Add members
                <InsertChannelMembers></InsertChannelMembers>
              </div>
            )}
            <input
              type="submit"
              value={!props.isUpdate ? "Create" : "Update"}
            />
          </form>
        </motion.div>
      </motion.div>
    </>
  );
};
