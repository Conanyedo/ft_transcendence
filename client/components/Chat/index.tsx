import Styles from "@styles/chat.module.css"
import addUser from "@public/add-user.svg"
import Image from "next/image"
import Avatar from "@public/profile.jpg"
import { ModalBox } from "@components/Modal";
import { GameIconAsset, ChannelAsset, BlueChannelAsset, MenuAsset, BackArrow } from "../../svg/index"
import Search from "@public/Icon.svg";
import { setMsg } from "@utils/chat";
import sendArrow from "@public/send-arrow.svg";
import arrowBack from "@public/arrow-back.svg";

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

export const ChatLeft = (props: { showCnv: any, displayBlueIcon: any, setShow: any, show: any, setDisplayBlueIcon: any, createChannel: any, filterChatUsers: any, lastUsers: any, chatUsersRefs: any, setChatUser: any }) => {
    return (<>
        <div className={`${Styles.chatLeft} ${props.showCnv ? Styles.hideUsers : ""}`}>
            <div className={Styles.leftContent}>
                <div className={Styles.topSection}>
                    <div className={Styles.msg}>Message</div>
                    {!props.displayBlueIcon && <div onClick={() => props.setShow(!props.show)} className={Styles.channel} onMouseOver={() => props.setDisplayBlueIcon(true)}><ChannelAsset color="#758293" /></div>}
                    {props.displayBlueIcon && <div onMouseLeave={() => props.setDisplayBlueIcon(false)} className={Styles.channel} onClick={() => props.setShow(!props.show)}><BlueChannelAsset /></div>}
                    <ModalBox show={props.show} setShow={props.setShow} createChannel={props.createChannel} />
                </div>
                <div className={Styles.chatSearch}>
                    <Image src={Search} width={20} height={20} />
                    <input type="Text" className={Styles.chatInput} placeholder="Search" onChange={(e) => props.filterChatUsers(e)} />
                </div>
                <div className={Styles.bottomSection}>
                    {props.lastUsers.map((user: any, i: any) => <div key={i} ref={(element) => { props.chatUsersRefs.current[i] = element }} className={Styles.chatUser} onClick={() => props.setChatUser(user, props.chatUsersRefs, i)}>
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

export const ChatRight = (props: {showCnv: any, currentUser: any, setShowCnv: any, profile: any, setShowprofile: any, showProfile: any, showUsrMenu: any, showMenuDropdown: any, setShowSetModal: any, chatMsgs: any, msgsDisplayDiv: any, messagesEndRef: any, enteredMsg: any, setEnteredMsg: any, sendInvite: any, setChatMsgs: any}) => {
    return (<div className={`${Styles.chatRight} ${props.showCnv ? Styles.displayChat : ""}`}>
        <div className={Styles.rightContent}>
            {props.currentUser && (<>
                <div className={Styles.topDetails}>
                    <div className={Styles.flex}>
                        <div className={Styles.arrowAsset}>
                            <Image src={arrowBack} width={16} height={16} onClick={() => props.setShowCnv(false)} />
                        </div>

                        {props.profile && <div onClick={() => props.setShowprofile(false)}><BackArrow /></div>}

                        <div onClick={props.currentUser?.channelName ? props.showProfile : () => null} className={Styles.flex}>
                            <div className={Styles.avatarProps}>
                                <Image src={props.currentUser?.imgSrc} width={76} height={76} className={Styles.avatar} />
                            </div>
                            <div>
                                <h1 className={Styles.chatUsername}>{props.currentUser?.channelName ? props.currentUser.channelName : props.currentUser?.fullName}</h1>
                                <p className={Styles.chatUserStatus}>{props.currentUser?.status}</p>
                            </div>
                        </div>

                    </div>
                    <div className={Styles.menu} onClick={props.showUsrMenu}><MenuAsset />

                        {props.showMenuDropdown && <div className={Styles.menuDropdown}>
                            <div onClick={() => console.log("Settings modal should be shown here")}>Settings</div>
                            <div>Leave Channel</div>
                        </div>}
                    </div>

                </div>
                {props.profile && (<Profile setShowSetModal={props.setShowSetModal} />)}
                {props.currentUser && !props.profile && <div className={Styles.chatSection}>
                    <div className={Styles.msgsDisplay} ref={props.msgsDisplayDiv}>
                        {
                            props.chatMsgs.map((chatMsg: any, i: any) => <div key={i} className={Styles.chatMsg} style={{ left: chatMsg.type == "receiver" ? "0" : "auto", right: chatMsg.type == "sender" ? "0" : "auto" }}>
                                <div className={Styles.msgBox} style={{ justifyContent: chatMsg.type == "receiver" ? "flex-start" : "flex-end" }}>
                                    <div ref={props.messagesEndRef} className={Styles.msgContent} style={{ backgroundColor: chatMsg.type == "receiver" ? "#3A3A3C" : "#409CFF", borderRadius: chatMsg.type == "receiver" ? "0 5px 5px 5px" : "5px 5px 0 5px" }}>
                                        {chatMsg.msgContent}
                                    </div>
                                </div>
                                <div className={Styles.msgTime} style={{ justifyContent: chatMsg.type == "receiver" ? "flex-start" : "flex-end" }}>{chatMsg.time}</div>
                            </div>)
                        }
                    </div>
                    <div className={Styles.sendDiv} style={{ gap: props.enteredMsg != "" ? "1.5rem" : "0" }}>
                        <div className={Styles.msgInput}>
                            <input type="text" placeholder="message" value={props.enteredMsg} onChange={(e) => props.setEnteredMsg(e.target.value)} onKeyDown={(event) => setMsg(props.enteredMsg, event.keyCode, props.setChatMsgs, props.chatMsgs, props.setEnteredMsg)} />
                            <div onClick={props.sendInvite} className={Styles.console}><GameIconAsset color="#D9D9D9" /></div>
                        </div>
                        <div onClick={() => setMsg(props.enteredMsg, 13, props.setChatMsgs, props.chatMsgs, props.setEnteredMsg)} className={Styles.sendCtr}>{props.enteredMsg && <Image src={sendArrow} width={30} height={30} className={Styles.animatedBtn} />}</div>
                    </div>

                </div>}
            </>)}

            {!props.currentUser && (<div className={Styles.newCnv}>
                <h1>Start a new conversation</h1>
            </div>)}

        </div>
    </div>)
}