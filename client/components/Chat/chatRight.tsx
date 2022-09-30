import { MembersModal } from "@components/MembersModal";
import { SettingsModal } from "@components/SettingsModal";
import { fetchDATA, leaveChannel } from "@hooks/useFetchData";
import Styles from "@styles/chat.module.css"
import { chatUser } from "@Types/dataTypes";
import { getLastConvs, scrollToBottom, sendInvite, setMsg, showProfile } from "@utils/chat";
import socket_notif from "config/socketNotif";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import arrowBack from "@public/arrow-back.svg";
import { ChatContext, ChatContextType } from "@contexts/chatContext";
import Image from "next/image";
import { BackArrow } from "@svg/index";
import { MenuAsset } from "@svg/index";
import { MenuDropdown } from "./MenuDropdown";
import { GameIconAsset } from "@svg/index";
import sendArrow from "@public/send-arrow.svg";
import { Profile } from "./Profile";


const NegParams = ["Muted", "Left", "Banned"];

const getLastUsers = async (setLastUsers: any, login: any, setCurrentUser: any, setChatMsgs: any, messagesEndRef: any, router: any) => {

    socket_notif.emit("getConversations", [], (response: any) => {

        if (response != undefined)
            setLastUsers(response);

        // handling the route login received
        if (login) {
            // check first if login exists
            let item: any = response.find((user: any) => user.login == login);

            if (item != undefined) {
                setCurrentUser(item);
                // get messages 
                socket_notif.emit("getMsgs", item?.convId, (response: any) => {
                    setChatMsgs(response);
                    // run on first render only
                    scrollToBottom(messagesEndRef);
                })

            } else {
                // if user doesnt exist start a new converation
                fetchDATA(setCurrentUser, router, `chat/loginInfo/${login}`);
                setChatMsgs([]);
            }
        }
    })
}

const setConvStatus = (currentUser: any, setStopUsr: any) => {
    if (NegParams.includes(currentUser?.relation)) {
        setStopUsr(currentUser.relation.toLowerCase());
    } else {
        setStopUsr("");
    }
}

export const ChatRight = (props: { setShowSetModal: any, login: number }) => {

    const { showCnv, setShowCnv, messagesEndRef, chatMsgs, setChatMsgs, setLastUsers, lastUsers } = useContext(ChatContext) as ChatContextType;

    // Setting some local state
    const [profile, setShowprofile] = useState(false);
    const [showMenuDropdown, setShowMenuDropdown] = useState(false);
    const [enteredMsg, setEnteredMsg] = useState("");

    // Settings and members modal show state
    const [showSetModal, setShowSetModal] = useState(false);
    const [membersMdl, showMembersMdl] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>();
    // const [lastUsers, setLastUsers] = useState([]);
    const [convId, setConvId] = useState<any>();
    const [stopUsr, setStopUsr] = useState("");

    // functions
    function showUsrMenu() {
        setShowMenuDropdown(!showMenuDropdown);
    }

    const router = useRouter();

    // refs
    const msgsDisplayDiv = useRef<any>();
    const token = getCookie("jwt");

    // UseEffect here
    useEffect(() => {
        getLastUsers(setLastUsers, props.login, setCurrentUser, setChatMsgs, messagesEndRef, router);
        // lets make an asychronous call here
        if (props.login !== undefined) {
            setShowCnv(true);
            setConvId(currentUser?.convId);
            setConvStatus(currentUser, setStopUsr);
            if (profile)
                setShowprofile(false);
        }
        else if (props.login == undefined) {
            setCurrentUser(undefined);
            router.push("/chat");
        }

        // run on first render only
        scrollToBottom(messagesEndRef);
    }, [props.login])

    useEffect(() => {
        // listening for new messages
        socket_notif.on("newMsg", (response) => {
            console.log(response);
            setChatMsgs([...chatMsgs, response] as any);
            setEnteredMsg("");
            setConvStatus(currentUser, setStopUsr);
            // reset the conversations
            getLastConvs(setLastUsers, () => null);
            scrollToBottom(messagesEndRef);
        })

        console.log(chatMsgs);
        console.log(currentUser);

        return () => {
            socket_notif.off('newMsg');
        }

    }, [chatMsgs]);

    useEffect(() => {
        console.log(lastUsers);
    }, [lastUsers]);

    useEffect(() => {
        console.log(currentUser);
        setConvStatus(currentUser, setStopUsr);
        setConvId(currentUser?.convId);
    }, [currentUser])

    const unshowCnv = () => {
        setShowCnv(false);
        router.push("/chat");
    }

    return (<div className={`${Styles.chatRight} ${showCnv ? Styles.displayChat : ""}`}>
        <MembersModal showSetModal={membersMdl} setShowSetModal={showMembersMdl} />
        <SettingsModal showSetModal={showSetModal} setShowSetModal={setShowSetModal} />
        {currentUser && <div className={`${Styles.rightContent}`} >
            {currentUser && (<>
                <div className={Styles.topDetails}>
                    <div className={Styles.flex}>
                        <div className={Styles.arrowAsset}>
                            <Image src={arrowBack} width={16} height={16} onClick={unshowCnv} />
                        </div>

                        {profile && <div onClick={() => setShowprofile(false)}><BackArrow /></div>}

                        <div onClick={currentUser?.membersNum ? () => showProfile(profile, setShowprofile) : () => null} className={Styles.flex}>
                            <div className={Styles.avatarProps}>
                                <img src={currentUser?.avatar} />
                            </div>
                            <div>
                                <h1 className={Styles.chatUsername}>{currentUser?.name ? currentUser.name : currentUser?.fullname}</h1>
                                <p className={Styles.chatUserStatus}>{currentUser?.membersNum ? currentUser?.membersNum + " members" : currentUser?.status}</p>
                            </div>
                        </div>

                    </div>
                    <div className={Styles.menu} onClick={showUsrMenu}><MenuAsset />
                        {showMenuDropdown && <MenuDropdown content={currentUser?.type == "Dm" ? [, "Block User"] : ["Settings", "Leave Channel"]} functions={[() => setShowSetModal(true), () => leaveChannel(currentUser.convId, router, setLastUsers, lastUsers)]} />}
                    </div>

                </div>
                {profile && (<Profile setShowSetModal={showMembersMdl} convId={currentUser.convId} />)}
                {currentUser && !profile && <div className={Styles.chatSection}>
                    <div className={Styles.msgsDisplay} ref={msgsDisplayDiv}>
                        {
                            chatMsgs.map((chatMsg: any, i: any) => <div key={i} className={Styles.chatMsg} style={{ left: chatMsg.sender == currentUser.login ? "0" : "auto", right: chatMsg.sender != currentUser.login ? "0" : "auto" }}>
                                {(currentUser.convId == chatMsg.convId) && <div className={Styles.msgBox} style={{ justifyContent: chatMsg.sender == currentUser.login ? "flex-start" : "flex-end" }}>
                                    <div ref={messagesEndRef} className={Styles.msgContent} style={{ backgroundColor: chatMsg.sender == currentUser.login ? "#3A3A3C" : "#409CFF", borderRadius: chatMsg.sender == currentUser.login ? "0 5px 5px 5px" : "5px 5px 0 5px" }}>
                                        {chatMsg.msg}
                                    </div>
                                </div>}
                                {(currentUser.convId == chatMsg.convId) && <div className={Styles.msgTime} style={{ justifyContent: chatMsg.sender == currentUser.login ? "flex-start" : "flex-end" }}>{chatMsg?.date?.substring(16, 11)}{chatMsg?.createDate?.substring(16, 11)}</div>}
                            </div>)}
                    </div>
                    {
                        chatMsgs.length == 0 && <div className={Styles.newCnv}>
                            <h1>{`Send your friend ${currentUser.name} a new message.`}</h1>
                        </div>
                    }
                    <div className={Styles.sendDiv} style={{ gap: enteredMsg != "" ? "1.5rem" : "0" }}>
                        {
                            (stopUsr == "" && currentUser.relation == "Blocker") && <div className={Styles.msgInput}><div className={Styles.newCnv}>You blocked this user</div></div>
                        }
                        {(stopUsr == "" && currentUser.relation != "Blocker") && <div className={Styles.msgInput}>
                            <input type="text" placeholder="message" value={enteredMsg} onChange={(e) => setEnteredMsg(e.target.value)} onKeyDown={(event) => setMsg(event.keyCode, enteredMsg, setEnteredMsg, currentUser.convId, currentUser.login, setStopUsr)} />
                            <div onClick={() => sendInvite} className={Styles.console}><GameIconAsset color="#D9D9D9" /></div>
                        </div>}
                        {
                            (stopUsr == "left" && currentUser.type != "Dm") && <div className={Styles.msgInput}><div className={Styles.newCnv}>You left this channel</div></div>
                        }
                        {
                            (["banned", "muted"].includes(stopUsr) && currentUser.type != "Dm") && <div className={Styles.msgInput}><div className={Styles.newCnv}>You were {stopUsr} from this channel</div></div>
                        }
                        {(stopUsr == "" && currentUser.relation != "Blocker") && <div onClick={(e) => setMsg(13, enteredMsg, setEnteredMsg, currentUser.convId, currentUser.login, setStopUsr)} className={Styles.sendCtr}>{enteredMsg && <Image src={sendArrow} width={30} height={30} className={Styles.animatedBtn} />}</div>}
                    </div>


                </div>}
            </>)}
        </div>}

        {(currentUser == undefined) && (<div className={Styles.newCnv}>
            <h1>Start a new conversation</h1>
        </div>)}
    </div>)
}