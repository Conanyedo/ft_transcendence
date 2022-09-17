import Styles from "@styles/chat.module.css"
import addUser from "@public/add-user.svg"
import Image from "next/image"
import Avatar from "@public/profile.jpg"
import { ModalBox } from "@components/Modal";
import { GameIconAsset, ChannelAsset, BlueChannelAsset, MenuAsset, BackArrow } from "../../svg/index"
import Search from "@public/Icon.svg";
import { setMsg, setChatUser, showProfile, sendInvite, filterChatUsers } from "@utils/chat";
import sendArrow from "@public/send-arrow.svg";
import arrowBack from "@public/arrow-back.svg";
import { chatUser } from "@Types/dataTypes";
import { ChatContext, ChatContextType } from "@contexts/chatContext";
import { useContext, useState, useRef, useEffect } from "react";
import { scrollToBottom } from "@utils/chat";
import { SettingsModal } from "@components/SettingsModal";
import { MembersModal } from "@components/MembersModal";
import Link from 'next/link'


const Members = (props: { role: string, users: Array<Object> }) => {

    const [dropdwn, setdropdwn] = useState(false);

    const setRefs: any = useRef([]);
    const MenuElement = () => {
        return (<MenuDropdown content={["Dismiss Admin", "Remove Member"]} functions={[() => console.log("test"), () => console.log("test")]} />)
    }

    // {dropdwn && menus.map((Element:any, i:any) => <div key={i} ref={element => setRefs.current[i] = element}><Element /></div>)}

    return (<div className={Styles.members}>
        {props.role}
        {props.users.map((user: any, i: number) => (<div key={i}>
            <div className={Styles.membersAvtr}>
                <Image src={user.avatar} width={40} height={40} />
                <span>{user.fullName}</span>
            </div>
            <div onClick={() => setdropdwn(!dropdwn)}>
                <MenuAsset />
                <div style={{ display: dropdwn ? "block" : "none" }} ref={element => setRefs.current[i] = element}><MenuElement /></div>
            </div>
        </div>))}
    </div>)
}

const Header = (props: { setShowSetModal: any }) => {
    return (<div className={Styles.profileHeader}>
        <h1>Channel Profile</h1>
        <button onClick={() => props.setShowSetModal(true)}><Image src={addUser} width={18} height={18} />Add Member</button>
    </div>)
}

export const Profile = (props: { setShowSetModal: any }) => {

    const owners = [{ fullName: "Ikram Kharbouch", avatar: Avatar }];
    const admins = [{ fullName: "Abdellah Belhachmi", avatar: Avatar }, { fullName: "Youness Bouddou", avatar: Avatar }]
    const members = [{ fullName: "Abdellah Belhachmi", avatar: Avatar }, { fullName: "Youness Bouddou", avatar: Avatar }, { fullName: "choaib abouelwafa", avatar: Avatar }, { fullName: "nounou lhilwa", avatar: Avatar }];

    return (<>
        <Header setShowSetModal={props.setShowSetModal} />
        <Members role="Owner" users={owners} key="Owner" />
        <Members role="Admins" users={admins} key="Admins" />
        <Members role="Members" users={members} key="Members" />
    </>)
}

export const ChatLeft = (props: {cnvs: any}) => {

    // Setting some local state
    const { lastUsers, setCurrentUser, setShowCnv, showCnv, setLastUsers, initialUsersState, chatUsersRefs, prevUser, setPrevUser } = useContext(ChatContext) as ChatContextType;
    const [show, setShow] = useState<boolean>(false);
    const [displayBlueIcon, setDisplayBlueIcon] = useState(false);

    // functions
    function createChannel(channelName: string, password: string, usrLen: number, setUsrTags: any, formik: any) {

        console.log(channelName);
        setShow(!show);
        const chatUser = { id: lastUsers.length, imgSrc: Avatar, channelName: channelName, status: usrLen === 10 ? "+" + usrLen + " Members" : usrLen + " Members" };
        setLastUsers([chatUser, ...lastUsers]);

        // select the current chat
        setChatUser(lastUsers[0], setShowCnv);

        // reset the necessary fields
        formik.setFieldValue("cName", "");
        formik.setFieldValue("password", "");
        formik.setFieldValue("member", "");
        setUsrTags([]);
    }

    return (<>
        <div className={`${Styles.chatLeft} ${showCnv ? Styles.hideUsers : ""}`}>
            <div className={Styles.leftContent}>
                <div className={Styles.topSection}>
                    <div className={Styles.msg}>Message</div>
                    {!displayBlueIcon && <div onClick={() => setShow(!show)} className={Styles.channel} onMouseOver={() => setDisplayBlueIcon(true)}><ChannelAsset color="#758293" /></div>}
                    {displayBlueIcon && <div onMouseLeave={() => setDisplayBlueIcon(false)} className={Styles.channel} onClick={() => setShow(!show)}><BlueChannelAsset /></div>}
                    <ModalBox show={show} setShow={setShow} createChannel={createChannel} />
                </div>
                <div className={Styles.chatSearch}>
                    <Image src={Search} width={20} height={20} />
                    <input type="Text" className={Styles.chatInput} placeholder="Search" onChange={(e) => filterChatUsers(e, lastUsers, setLastUsers, initialUsersState)} />
                </div>
                <div className={Styles.bottomSection}>
                    {props.cnvs.map((user: any, i: any) => <Link href={"/chat?id=" + i} key={i}><div key={i} ref={(element) => { chatUsersRefs.current[parseInt(i)] = element }} className={Styles.chatUser}>
                         <div className={Styles.avatarName}>
                            <Image src={user.avatar} width={49.06} height={49} className={Styles.avatar} />
                            <div className={Styles.username}>{user.fullname} {user.channelname}</div>
                        </div>
                        <p className={Styles.status}>{user.status}</p>
                    </div></Link>)}
                </div>
            </div>
        </div>
    </>)
}

export const ChatRight = (props: { setShowSetModal: any, uid: number }) => {

    const { lastUsers, showCnv, setShowCnv, chatMsgs, setChatMsgs, messagesEndRef } = useContext(ChatContext) as ChatContextType;

    // Setting some local state
    const [profile, setShowprofile] = useState(false);
    const [showMenuDropdown, setShowMenuDropdown] = useState(false);
    const [enteredMsg, setEnteredMsg] = useState("");

    // Settings and members modal show state
    const [showSetModal, setShowSetModal] = useState(false);
    const [membersMdl, showMembersMdl] = useState(false);
    const [currentUser, setCurrentUser] = useState(lastUsers[0]);


    // functions
    function showUsrMenu() {
        setShowMenuDropdown(!showMenuDropdown);
    }

    // refs
    const msgsDisplayDiv = useRef<any>();

    // UseEffect here
    useEffect(() => {
        scrollToBottom(messagesEndRef);
        if (props.uid) {
            setCurrentUser(lastUsers[props.uid]);
        }
            
    }, [chatMsgs, currentUser, props.uid])

    return (<div className={`${Styles.chatRight}`}>
        <MembersModal showSetModal={membersMdl} setShowSetModal={showMembersMdl} />
        <SettingsModal showSetModal={showSetModal} setShowSetModal={setShowSetModal} />
        {currentUser && <div className={`${Styles.rightContent} ${showCnv ? Styles.displayChat : ""}`} >
            {currentUser && (<>
                <div className={Styles.topDetails}>
                    <div className={Styles.flex}>
                        <div className={Styles.arrowAsset}>
                            <Image src={arrowBack} width={16} height={16} onClick={() => setShowCnv(false)} />
                        </div>

                        {profile && <div onClick={() => setShowprofile(false)}><BackArrow /></div>}

                        <div onClick={currentUser?.channelName ? () => showProfile(profile, setShowprofile) : () => null} className={Styles.flex}>
                            <div className={Styles.avatarProps}>
                                <Image src={currentUser?.imgSrc} width={76} height={76} className={Styles.avatar} />
                            </div>
                            <div>
                                <h1 className={Styles.chatUsername}>{currentUser?.channelName ? currentUser.channelName : currentUser?.fullName}</h1>
                                <p className={Styles.chatUserStatus}>{currentUser?.status}</p>
                            </div>
                        </div>

                    </div>
                    <div className={Styles.menu} onClick={showUsrMenu}><MenuAsset />
                        {showMenuDropdown && <MenuDropdown content={["Settings", "Leave Channel"]} functions={[() => setShowSetModal(true), () => console.log("test")]} />}
                    </div>

                </div>
                {profile && (<Profile setShowSetModal={props.setShowSetModal} />)}
                {currentUser && !profile && <div className={Styles.chatSection}>
                    <div className={Styles.msgsDisplay} ref={msgsDisplayDiv}>
                        {
                            chatMsgs.map((chatMsg: any, i: any) => <div key={i} className={Styles.chatMsg} style={{ left: chatMsg.type == "receiver" ? "0" : "auto", right: chatMsg.type == "sender" ? "0" : "auto" }}>
                                <div className={Styles.msgBox} style={{ justifyContent: chatMsg.type == "receiver" ? "flex-start" : "flex-end" }}>
                                    <div ref={messagesEndRef} className={Styles.msgContent} style={{ backgroundColor: chatMsg.type == "receiver" ? "#3A3A3C" : "#409CFF", borderRadius: chatMsg.type == "receiver" ? "0 5px 5px 5px" : "5px 5px 0 5px" }}>
                                        {chatMsg.msgContent}
                                    </div>
                                </div>
                                <div className={Styles.msgTime} style={{ justifyContent: chatMsg.type == "receiver" ? "flex-start" : "flex-end" }}>{chatMsg.time}</div>
                            </div>)
                        }
                    </div>
                    <div className={Styles.sendDiv} style={{ gap: enteredMsg != "" ? "1.5rem" : "0" }}>
                        <div className={Styles.msgInput}>
                            <input type="text" placeholder="message" value={enteredMsg} onChange={(e) => setEnteredMsg(e.target.value)} onKeyDown={(event) => setMsg(event, enteredMsg, setChatMsgs, chatMsgs, setEnteredMsg)} />
                            <div onClick={() => sendInvite} className={Styles.console}><GameIconAsset color="#D9D9D9" /></div>
                        </div>
                        <div onClick={(e) => setMsg(event, enteredMsg, setChatMsgs, chatMsgs as Object[], setEnteredMsg)} className={Styles.sendCtr}>{enteredMsg && <Image src={sendArrow} width={30} height={30} className={Styles.animatedBtn} />}</div>
                    </div>

                </div>}
            </>)}

            {!currentUser && (<div className={Styles.newCnv}>
                <h1>Start a new conversation</h1>
            </div>)}

        </div>}
    </div>)
}

export function InviteMsg(invitedUser: chatUser) {
    return (<div className={Styles.inviteMsg}>
        <div>
            <Image src={invitedUser.imgSrc} width={38} height={38} className={Styles.inviteAvatar} />
            <div>
                {invitedUser.fullName}
                <p>You invite them to play pong game</p>
            </div>
        </div>
        <button className={Styles.inviteBtn}>Cancel Invitation</button>
    </div>)
}

export const MenuDropdown = (props: { content: Array<string>, functions: Array<any> }) => {

    return (<div className={Styles.menuDropdown}>
        {props.content.map((element, i) => <div key={i} onClick={props.functions[i]}>{element}</div>)}
    </div>)
}