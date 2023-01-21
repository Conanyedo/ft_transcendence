import Styles from "@styles/Chat/CreateChannel.module.css";
import CloseIcon from "@public/Cross.svg";
import UploadIcon from "../../public/FriendIcons/UploadIcon.svg";
import Eye from "@public/Chat/Eye.svg";
import CloseEye from "@public/Chat/Eye-closed.svg";
import { InsertChannelMembers } from "./InserChannelMembers";
import { useState, useReducer } from "react";
import { motion } from "framer-motion";
import { ChannelData } from "@Types/dataTypes";

const initialChnlState: ChannelData = {
  avatar: "",
  name: "",
  type: "Public",
  password: "",
  members: [],
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "avatar":
      return { ...state, avatar: action.avatar };
    case "name":
      return { ...state, name: action.name };
    case "type":
      return { ...state, type: action.chnltype };
    case "password":
      return { ...state, password: action.password };
    case "members":
      return { ...state, members: action.members };
  }
};

const validPassword = RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
);

interface Props {
  isUpdate: boolean;
  initialChnlState: ChannelData;
  CloseChannelHandler: () => void;
}

export const CreateChannel: React.FC<Props> = ({
  isUpdate,
  initialChnlState,
  CloseChannelHandler,
}) => {
  const [state, dispatch] = useReducer(reducer, initialChnlState);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [ChnlError, setChnlError] = useState<string[]>(["", ""]);

  const chnltypeDescription: string = `${
    state.type === "Public"
      ? "All users can find and join this channel"
      : state.type === "Private"
      ? "Only users you invited can join the channel"
      : "All users can find the channel but only those with the provided password can join"
  }`;

  const checkIsValidForm = () => {
    if (state.name.length < 4)
      setChnlError(["channelName", "invalid Channel Name"]);
    else if (
      (!isUpdate && state.type === "Protected" && !validPassword.test(state.password)) ||
      (isUpdate &&
        state.type === "Protected" &&
        state.password.length > 0 &&
        !validPassword.test(state.password))
    )
      setChnlError([
        "channelPassword",
        "invalid Password (minimum 8 characters long)",
      ]);
    else if (state.members.length < 1)
      setChnlError([
        "channelMembers",
        "invalid channel members (at least 1 member)",
      ]);
  };

  const FormSubmitHandler = (event: any) => {
    event.preventDefault();
    checkIsValidForm();
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
            onSubmit={FormSubmitHandler}
          >
            <div className={Styles.CreateChannelHeader}>
              <div>{!isUpdate ? "Create Channel" : "Update Channel"}</div>
              <img src={CloseIcon.src} onClick={CloseChannelHandler} />
            </div>
            {isUpdate && (
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
              <input
                type={"text"}
                value={state.name}
                name="channelName"
                onChange={(e) =>
                  dispatch({ type: "name", name: e.target.value })
                }
              />
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
                  checked={state.type === "Public"}
                />
                <label
                  className={Styles.Switch}
                  htmlFor="Public"
                  onClick={(e) => {
                    dispatch({ type: "type", chnltype: "Public" });
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
                  checked={state.type === "Private"}
                />
                <label
                  className={Styles.Switch}
                  htmlFor="Private"
                  onClick={(e) => {
                    dispatch({ type: "type", chnltype: "Private" });
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
                  checked={state.type === "Protected"}
                />
                <label
                  className={Styles.Switch}
                  htmlFor="Protected"
                  onClick={(e) => {
                    dispatch({ type: "type", chnltype: "Protected" });
                  }}
                ></label>
              </span>
            </div>
            <p className={Styles.ChnlTypeDescription}>{chnltypeDescription}</p>
            {state.type === "Protected" && (
              <div className={Styles.ChannelTxtInput}>
                Password
                <div className={Styles.ChannelPsswdInput}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="channelPassword"
                    onChange={(e) =>
                      dispatch({ type: "password", password: e.target.value })
                    }
                  ></input>
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
            {!isUpdate && (
              <div className={Styles.ChannelTxtInput}>
                Add members
                <InsertChannelMembers state={state} dispatch={dispatch} />
                {ChnlError[0] === "channelMembers" && (
                  <p className={Styles.ChnlError}>{ChnlError[1]}</p>
                )}
              </div>
            )}
            <input type="submit" value={!isUpdate ? "Create" : "Update"} />
          </form>
        </motion.div>
      </motion.div>
    </>
  );
};
