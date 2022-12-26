import { useState } from "react";
import Styles from "@styles/Chat/ChatConversations.module.css"
import Searchicon from "../../public/SearchIcon.svg"
import Addchannel from "../../public/Chat/AddChannel.svg";
import Addchannelselected from "../../public/Chat/AddChannelSelected.svg";
import { Conversation } from "./Conversation";

// import { ChannelAsset, BlueChannelAsset } from "@svg/index";


export const ChatConversations = () => {
    const [isAddChannel, setisAddChannel] = useState(false);

    const AddChannelHandler = () => {
        setisAddChannel(true);
    }

    return (
        <>
        <div className={Styles.ChatConversations}>
            <div className={Styles.ChatConvHeader}>
                <div>Messsages</div>
                <div className={Styles.AddChannelicn} onClick={AddChannelHandler}>
                    {(!isAddChannel && (
                        <img src={Addchannel.src} alt="addchannel"></img>
                    ))
                    || (<img src={Addchannelselected.src} alt="addchannelselected"></img>)}
                </div>
            </div>
            <div className={Styles.ConvSearch}>
                <img src={Searchicon.src} alt="ConvSearchicon" />
                <input type={'text'} placeholder="Search"></input>
            </div>
            <div className={Styles.Conversationlist}>
            <Conversation></Conversation>
            <Conversation></Conversation>
            <Conversation></Conversation>
            <Conversation></Conversation>
            <Conversation></Conversation>
            <Conversation></Conversation>
            <Conversation></Conversation>
            <Conversation></Conversation>
            <Conversation></Conversation>
            <Conversation></Conversation>
            </div>
        </div>
        </>
    );
}
