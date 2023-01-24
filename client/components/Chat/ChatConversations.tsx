import Styles from "@styles/Chat/ChatConversations.module.css";
import {
  useState,
  Dispatch,
  SetStateAction,
  useLayoutEffect,
} from "react";
import Searchicon from "../../public/SearchIcon.svg";
import Addchannel from "../../public/Chat/AddChannel.svg";
import Addchannelselected from "../../public/Chat/AddChannelSelected.svg";
import { ChannelData, conversations, initialconv } from "@Types/dataTypes";
import { Conversation } from "./Conversation";
import { CreateChannel } from "./CreateChannel";
import { useRouter } from "next/router";

const initialChnlState: ChannelData = {
  avatar: "",
  name: "",
  type: "Public",
  password: "",
  members: [],
};

interface Props {
  isMobile: boolean;
  convs: conversations[];
  selectedConv: string | string[];
  setIsDirectMsg: Dispatch<SetStateAction<boolean>>;
  setConvData: Dispatch<SetStateAction<conversations>>;
  setselectedConv: Dispatch<SetStateAction<string | string[]>>;
  updateConversations: (msgConvId: string) => void;
}

export const ChatConversations: React.FC<Props> = ({
  isMobile,
  convs,
  selectedConv,
  setConvData,
  updateConversations,
  setselectedConv,
  setIsDirectMsg,
}) => {
  const [showAddChannel, setshowAddChannel] = useState<boolean>(false);
  const [searchConv, setsearchConv] = useState<string>("");
  const router = useRouter();

  const AddChannelClickHandler = () => {
    setshowAddChannel(true);
  };

  const CloseChannelHandler = () => {
    setshowAddChannel(false);
  };

  console.log("selected conv in hcat cnv ", selectedConv);

  return (
    <>
      {showAddChannel && (
        <CreateChannel
          isUpdate={false}
          initialChnlState={initialChnlState}
          CloseChannelHandler={CloseChannelHandler}
          updateConversations={updateConversations}
        />
      )}
      <div
        className={Styles.ChatConversations}
        style={
          isMobile
            ? selectedConv === "0"
              ? { width: "100%" }
              : { width: "0" }
            : {}
        }
      >
        <div className={Styles.ChatConvHeader}>
          <div>Messsages</div>
          <div
            className={Styles.AddChannelicn}
            onClick={AddChannelClickHandler}
          >
            {(!showAddChannel && (
              <img src={Addchannel.src} alt="addchannel"></img>
            )) || (
              <img src={Addchannelselected.src} alt="addchannelselected"></img>
            )}
          </div>
        </div>
        <div className={Styles.ConvSearch}>
          <img src={Searchicon.src} alt="ConvSearchicon" />
          <input
            type={"text"}
            placeholder="Search"
            onChange={(e) => setsearchConv(e.target.value)}
          ></input>
        </div>
        <div className={Styles.Conversationlist}>
          {convs.length > 0 ? (
            convs.map((conv: conversations) => {
              if (conv.name.toUpperCase().includes(searchConv.toUpperCase()))
                return (
                  <Conversation
                    key={conv.convId}
                    convId={conv.convId}
                    avatar={conv.avatar}
                    name={conv.name}
                    membersNum={conv.membersNum}
                    status={conv.status}
                    unread={conv.unread}
                    type={conv.type}
                    selected={
                      selectedConv === conv.convId ||
                      selectedConv === conv.login
                    }
                    setSelectedConv={setselectedConv}
                  />
                );
            })
          ) : (
            <h1>No Conversations</h1>
          )}
        </div>
      </div>
    </>
  );
};
