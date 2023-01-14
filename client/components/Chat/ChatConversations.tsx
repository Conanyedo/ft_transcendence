import Styles from "@styles/Chat/ChatConversations.module.css";
import { useState, Dispatch, SetStateAction } from "react";
import Searchicon from "../../public/SearchIcon.svg";
import Addchannel from "../../public/Chat/AddChannel.svg";
import Addchannelselected from "../../public/Chat/AddChannelSelected.svg";
import { conversations} from "@Types/dataTypes";
import { Conversation } from "./Conversation";
import { CreateChannel } from "./CreateChannel";

// import { ChannelAsset, BlueChannelAsset } from "@svg/index";

interface Props {
  isMobile: boolean;
  convs: conversations[];
  selectedConv: number;
  setselectedConv: Dispatch<SetStateAction<number>>;
}

export const ChatConversations: React.FC<Props> = ({
  isMobile,
  convs,
  selectedConv,
  setselectedConv,
}) => {
  const [showAddChannel, setshowAddChannel] = useState<boolean>(false);
  const [searchConv, setsearchConv] = useState<string>("");

  const AddChannelClickHandler = () => {
    setshowAddChannel(true);
  };

  const CloseChannelHandler = () => {
    setshowAddChannel(false);
  };

  return (
    <>
      {showAddChannel ? (
        <CreateChannel isUpdate={false} CloseChannelHandler={CloseChannelHandler} />
      ) : null}
      <div
        className={Styles.ChatConversations}
        style={
          isMobile
            ? selectedConv === 0
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
          {convs.map((conv: conversations) => {
            if (conv.fullName.toUpperCase().includes(searchConv.toUpperCase()))
              return (
                <Conversation
                  key={conv.convid}
                  avatar={conv.avatar}
                  fullName={conv.fullName}
                  membersNum={conv.membersNum}
                  status={conv.status}
                  read={conv.read}
                  selected={selectedConv === conv.convid}
                  onClick={() => setselectedConv(conv.convid)}
                />
              );
          })}
        </div>
      </div>
    </>
  );
};
