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
import { useContext, useState, useRef } from "react";

const Members = (props: { role: string, users: Array<Object> }) => {
    return (<div className={Styles.members}>
        {props.role}
        {props.users.map((user: any) => (<div>
            <div className={Styles.membersAvtr}>
                <Image src={user.avatar} width={40} height={40} />
                <span>{user.fullName}</span>
            </div>
            <MenuAsset />
        </div>))}
    </div>)
}

const Header = (props: {setShowSetModal: any}) => {
    return (<div className={Styles.profileHeader}>
        <h1>Channel Profile</h1>
        <button onClick={() => props.setShowSetModal(true)}><Image src={addUser} width={18} height={18} />Add Member</button>
    </div>)
}

export const Profile = (props: {setShowSetModal: any}) => {

    const owners = [{ fullName: "Ikram Kharbouch", avatar: Avatar }];
    const admins = [{ fullName: "Abdellah Belhachmi", avatar: Avatar }, { fullName: "Youness Bouddou", avatar: Avatar }]
    const members = [{ fullName: "Abdellah Belhachmi", avatar: Avatar }, { fullName: "Youness Bouddou", avatar: Avatar }, { fullName: "choaib abouelwafa", avatar: Avatar }, { fullName: "nounou lhilwa", avatar: Avatar }];

    return (<>
        <Header setShowSetModal={props.setShowSetModal}/>
        <Members role="Owner" users={owners} key="Owner"/>
        <Members role="Admins" users={admins} key="Admins"/>
        <Members role="Members" users={members} key="Members" />
    </>)
}

export const ChatLeft = () => {
    
    // Setting some local state
    const { lastUsers, setCurrentUser, setShowCnv, showCnv, setLastUsers, initialUsersState } = useContext(ChatContext) as ChatContextType;
    const [show, setShow] = useState<boolean>(false);
    const [displayBlueIcon, setDisplayBlueIcon] = useState(false);
    const [prevUser, setPrevUser] = useState<number>(0);

    // setting the chat users refs
    const chatUsersRefs: Array<HTMLDivElement> | any = useRef([]);

    // functions
    function createChannel(channelName: string, password: string, usrLen: number, setShow: any) {

        console.log(channelName);
        setShow(!show);
        const chatUser = { id: lastUsers.length, imgSrc: Avatar, channelName: channelName, status: usrLen === 10 ? "+" + usrLen + " Members" : usrLen + " Members" };
        setLastUsers([chatUser, ...lastUsers]);
    
        // select the current chat
        setChatUser(lastUsers[0], chatUsersRefs, 0, setCurrentUser, setPrevUser, setShowCnv, prevUser);
    }

    // function filterChatUsers(e:any) {
    //     console.log("filter chat users");
    // }

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
                    {lastUsers.map((user: any, i: any) => <div key={i} ref={(element) => { chatUsersRefs.current[i] = element }} className={Styles.chatUser} onClick={() => setChatUser(user, chatUsersRefs, i, setCurrentUser, setPrevUser, setShowCnv, prevUser)}>
                        <div className={Styles.avatarName}>
                            <Image src={user.imgSrc} width={49.06} height={49} className={Styles.avatar} />
                            <div className={Styles.username}>{user.fullName} {user.channelName}</div>
                        </div>
                        <p className={Styles.status}>{user.status}</p>
                    </div>)}
                </div>
            </div>
        </div>
    </>)
}

export const ChatRight = (props: { setShowSetModal: any }) => {

    const { currentUser, showCnv, setShowCnv, chatMsgs, setChatMsgs } = useContext(ChatContext) as ChatContextType;

    // Setting some local state
    const [profile, setShowprofile] = useState(false);
    const [showMenuDropdown, setShowMenuDropdown] = useState(false);
    const [enteredMsg, setEnteredMsg] = useState("");

    // functions
    function showUsrMenu() {
		setShowMenuDropdown(!showMenuDropdown);
	}

    // refs
    const msgsDisplayDiv = useRef<any>();
    const messagesEndRef: HTMLDivElement | any = useRef<HTMLDivElement>(null);

    return (<div className={`${Styles.chatRight} ${showCnv ? Styles.displayChat : ""}`}>
        <div className={Styles.rightContent}>
            {currentUser && (<>
                <div className={Styles.topDetails}>
                    <div className={Styles.flex}>
                        <div className={Styles.arrowAsset}>
                            <Image src={arrowBack} width={16} height={16} onClick={() => setShowCnv(false)} />
                        </div>

                        {profile && <div onClick={() => setShowprofile(false)}><BackArrow /></div>}

                        <div onClick={currentUser?.channelName ? () => showProfile : () => null} className={Styles.flex}>
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

                        {showMenuDropdown && <div className={Styles.menuDropdown}>
                            <div onClick={() => console.log("Settings modal should be shown here")}>Settings</div>
                            <div>Leave Channel</div>
                        </div>}
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
                            <input type="text" placeholder="message" value={enteredMsg} onChange={(e) => setEnteredMsg(e.target.value)} onKeyDown={(event) => setMsg(enteredMsg, event.keyCode, setChatMsgs, chatMsgs, setEnteredMsg)} />
                            <div onClick={() => sendInvite} className={Styles.console}><GameIconAsset color="#D9D9D9" /></div>
                        </div>
                        <div onClick={() => setMsg(enteredMsg, 13, setChatMsgs, chatMsgs as Object[], setEnteredMsg)} className={Styles.sendCtr}>{enteredMsg && <Image src={sendArrow} width={30} height={30} className={Styles.animatedBtn} />}</div>
                    </div>

                </div>}
            </>)}

            {!currentUser && (<div className={Styles.newCnv}>
                <h1>Start a new conversation</h1>
            </div>)}

        </div>
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