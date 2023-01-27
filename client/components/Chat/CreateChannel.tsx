import Styles from "@styles/Chat/CreateChannel.module.css";
import CloseIcon from "@public/Cross.svg";
import UploadIcon from "../../public/FriendIcons/UploadIcon.svg";
import Eye from "@public/Chat/Eye.svg";
import CloseEye from "@public/Chat/Eye-closed.svg";
import { InsertChannelMembers } from "./InserChannelMembers";
import { useState, useReducer, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChannelData } from "@Types/dataTypes";
import { fetchCreateChannel, fetchUpdateChannel } from "@hooks/useFetchData";
import { useRouter } from "next/router";
import { getImageBySize, useOutsideAlerter } from "@hooks/Functions";
import { type } from "os";
import { ChannelMember } from "./ChannelMember";

const chnlError: { [key: string]: string } = {
  channelName: "invalid Channel Name",
  channelPassword: "invalid Password (minimum 8 characters long)here",
  channelMembers: "invalid channel members (at least 1 member)",
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
  /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/
);

interface Props {
  isUpdate: boolean;
  convId?: string;
  initialChnlState: ChannelData;
  CloseChannelHandler: () => void;
  updateConversations: (msgConvId: string) => void;
}

export const CreateChannel: React.FC<Props> = ({
  isUpdate,
  convId,
  initialChnlState,
  CloseChannelHandler,
  updateConversations,
}) => {
  const [state, dispatch] = useReducer(reducer, initialChnlState);
  const [chnlConvId, setChnlConvId] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorKey, setErrorKey] = useState<string>("");
  const [responseError, setResponseError] = useState<string>("");
  const avatarRef = useRef<any>(null);
  const imageFileRef = useRef<any>(null);
  const refOption = useRef(null);
  const router = useRouter();
  const ImgPath = getImageBySize(state.avatar, 70);

  const chnltypeDescription: string = `${
    state.type === "Public"
      ? "All users can find and join this channel"
      : state.type === "Private"
      ? "Only users you invited can join the channel"
      : "All users can find the channel but only those with the provided password can join"
  }`;

  const checkIsValidForm = () => {
    if (isUpdate) {
      if (state.name.length < 4 || state.name.length > 20) return "channelName";
      else if (
        (state?.password?.length > 0 ||
          (initialChnlState.type !== "Protected" &&
            state.type === "Protected")) &&
        !validPassword.test(state.password)
      ) {
        console.log("init : ", initialChnlState.type);
        console.log("state : ", state.type);

        return "channelPassword";
      }
    } else {
      if (state.name.length < 4) return "channelName";
      else if (
        state.type === "Protected" &&
        !validPassword.test(state.password)
      )
        return "channelPassword";
      else if (state.members.length < 1) return "channelMembers";
    }
    return "";
  };

  const formSubmitHandler = async (event: any) => {
    event.preventDefault();
    let err = checkIsValidForm();
    console.log(err);
    if (err?.length === 0) {
      if (!isUpdate)
        await fetchCreateChannel(setChnlConvId, state, setResponseError);
      else if (convId) {
        await fetchUpdateChannel(state, convId, imageFileRef, setResponseError);
        updateConversations(convId);
        CloseChannelHandler();
      }
    }
    setErrorKey(err);
  };

  useEffect(() => {
    const avatar = avatarRef.current;
    const imgFile = imageFileRef.current;
    imgFile?.addEventListener("change", () => {
      avatar.src = URL.createObjectURL(imgFile.files[0]);
    });
  }, []);

  useEffect(() => {
    if (chnlConvId && errorKey.length === 0) {
      updateConversations(chnlConvId);
      router.push({ pathname: "/chat", query: { channel: chnlConvId } });
      CloseChannelHandler();
    }
  }, [chnlConvId]);

  const closeOptions = (v: boolean) => {
    CloseChannelHandler();
  };

  useOutsideAlerter(refOption, closeOptions);
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
          ref={refOption}
        >
          <form
            className={Styles.CreateChannelContainer}
            onSubmit={formSubmitHandler}
          >
            <div className={Styles.CreateChannelHeader}>
              <div>{!isUpdate ? "Create Channel" : "Update Channel"}</div>
              <img src={CloseIcon.src} onClick={CloseChannelHandler} />
            </div>
            {isUpdate && (
              <label className={Styles.ChannelImage} htmlFor="channelImage">
                <img src={ImgPath} alt="channelImage" ref={avatarRef} />
                <input
                  type={"file"}
                  id="channelImage"
                  name="channelImage"
                  accept=".png, .jpg, .jpeg"
                  ref={imageFileRef}
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
              {errorKey === "channelName" && (
                <p className={Styles.ChnlError}>{chnlError[errorKey]}</p>
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
                {errorKey === "channelPassword" && (
                  <p className={Styles.ChnlError}>{chnlError[errorKey]}</p>
                )}
              </div>
            )}
            {!isUpdate && (
              <div className={Styles.ChannelTxtInput}>
                Add members
                <InsertChannelMembers
                  state={state}
                  dispatch={dispatch}
                  chnlMembers={[]}
                />
                {errorKey[0] === "channelMembers" && (
                  <p className={Styles.ChnlError}>{chnlError[errorKey]}</p>
                )}
              </div>
            )}
            {responseError.length > 0 && errorKey.length === 0 && (
              <p className={Styles.ChnlError}>{responseError}</p>
            )}
            <input type="submit" value={!isUpdate ? "Create" : "Update"} />
          </form>
        </motion.div>
      </motion.div>
    </>
  );
};
