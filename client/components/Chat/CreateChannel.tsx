import Styles from "@styles/Chat/CreateChannel.module.css";
import CloseIcon from "@public/Cross.svg";
import { InsertChannelMembers } from "./InserChannelMembers";
import { useState } from "react";
import { motion } from "framer-motion";
import { time } from "console";
import { type } from "os";

interface Channelmember {
  fullName: string;
  selected: boolean;
}

interface ChannelData {
  avatar: string;
  channelName: string;
  members: Channelmember[];
  cahnnelType: string;
  password: string;
}

interface friends {
  fullName: string;
  avatar: string;
}

const friendlist: friends[] = [
  {
    fullName: "Roronoa Zoro",
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
  },
  {
    fullName: "Sakazuki Akaina",
    avatar:
      "https://i.pinimg.com/originals/2e/94/a0/2e94a0d1a109f506d542decca10af75e.jpg",
  },
  {
    fullName: "Monkey D Luffy",
    avatar:
      "https://img.assinaja.com/upl/lojas/mundosinfinitos/imagens/foto-one-piece.png",
  },
  {
    fullName: "Kozuki Oden",
    avatar:
      "https://nintendoeverything.com/wp-content/uploads/OPPW4-DLC_12-10-20.jpg",
  },
];

const validPassword = RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
);

const isUpdate : boolean = false;

export const CreateChannel = () => {
  const [Chnltype, setChnlType] = useState<string>("Public");
  const [ChnlError, setChnlError] = useState<string[]>(["", ""]);

  const chnltypeDescription: string = `${
    Chnltype === "Public"
      ? "All users can find and join this channel"
      : Chnltype === "Private"
      ? "Only users you invited can join the channel"
      : "All users can find the channel but only those with the provided password can join"
  }`;

  const CloseChannelHandler = () => {
    console.log("Close Channel");
  };

  const ChnlTypeClickHandler = (e: any) => {
    console.log(e.target.value);
  };

  const FormSubmitHandler = (event: any) => {
    event.preventDefault();
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
    console.log(ChnlError);
  };

  return (
    <>
      {/* <div className={Styles.CreateChannelContainer}>
        <div className={Styles.CreateChannelHeader}>
          <div>Create Channel</div>
          <img src={CloseIcon.src} onClick={CloseChannelHandler} />
        </div>
        <div className={Styles.ChannelTxtInput}>
          <div>Channel name</div>
          <input type={"text"}></input>
        </div>
        <div className={Styles.ChannelType}>
          <span className={Styles.ChnlTypeContainer}>
            Public
            <input type="checkbox" id="Public" defaultChecked />
            <label className={Styles.Switch} htmlFor="Public"></label>
          </span>
          <span className={Styles.ChnlTypeContainer}>
            Private
            <input type="checkbox" id="Private" />
            <label className={Styles.Switch} htmlFor="Private"></label>
          </span>
          <span className={Styles.ChnlTypeContainer}>
            Protected
            <input type="checkbox" id="Protected" value='Protected'/>
            <label
              className={Styles.Switch}
              htmlFor="Protected"
            ></label>
          </span>
        </div>
          <p className={Styles.ChnlTypeExp}>All users can find and join this channel</p>
        <div className={Styles.ChannelTxtInput}>
          Password
          <input className={Styles.ChnlTxtInput} type={"text"}></input>
        </div>
        <div className={Styles.ChannelTxtInput}>
          Add members
          <input type={"text"}></input>
        </div>
        <div
          className={Styles.CreateChnlButton}
          onClick={(e) => {
            console.log("Create channel");
          }}
        >
          Create
        </div>
      </div> */}
      <form
        className={Styles.CreateChannelContainer}
        onSubmit={(e) => {
          FormSubmitHandler(e);
        }}
      >
        <div className={Styles.CreateChannelHeader}>
          <div>{!isUpdate ? "Create Channel" : "Update Channel"}</div>
          <img src={CloseIcon.src} onClick={CloseChannelHandler} />
        </div>
       { isUpdate && <label className={Styles.ChannelImage} htmlFor="channelImage">
          <img src="https://otsukai.com/public/item/41345/5f3e27993c0ce.png?operation=resize&w=960" alt="channelImage" />
        <input type={"file"} id="channelImage" name="channelImage"></input>
        </label>}
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
          <div
            // initial={{ opacity: 0, y: "-100%" }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 0.1 }}
            className={Styles.ChannelTxtInput}
          >
            Password
            <input type={"text"} name="channelPassword"></input>
            {ChnlError[0] === "channelPassword" && (
              <p className={Styles.ChnlError}>{ChnlError[1]}</p>
            )}
          </div>
        )}
       { !isUpdate && <div className={Styles.ChannelTxtInput}>
          Add members
          <InsertChannelMembers></InsertChannelMembers>
        </div>}
        <input type="submit" value={!isUpdate ? "Create" : "Update"} />
      </form>
    </>
  );
};
