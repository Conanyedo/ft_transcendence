import Styles from '@styles/Chat/ChatMessages.module.css';
import ChatMsgSetting from '@public/Chat/ThreeDots.svg';
import Backarrow from '@public/ArrowLeft.svg';
import { ChatMessageInput } from './ChatMessageInput';
import { Message } from './Message';


const BackarrowHandleClick = () => {
    console.log('Back to Chat root');
}

const ChatMsgProfileHandleClick = () => {
    console.log('Go to User profile');
}

export interface MsgData {
    fullName : string
    Sender: boolean,
    GameInvite: boolean,
    Content: string
    Date: string 
};

const MsgList : MsgData[] = [
    {fullName : "Choaib Abouelwafa", Sender : true, GameInvite : false, Content : 'hello', Date:'7:00'},
    {fullName : "Choaib Abouelwafa", Sender : true, GameInvite : false, Content : 'how r u', Date:'7:00'},
    {fullName : "Abdellah belhachmi", Sender : false, GameInvite : false, Content : 'hey wassup', Date:'7:00'},
    {fullName : "Abdellah belhachmi", Sender : false, GameInvite : false, Content : 'im good u?', Date:'7:00'},
    {fullName : "Choaib Abouelwafa", Sender : true, GameInvite : false, Content : 'im fine thanks', Date:'7:00'},
    {fullName : "Choaib Abouelwafa", Sender : false, GameInvite : true, Content : '', Date:'7:00'},
    {fullName : "Choaib Abouelwafa", Sender : true, GameInvite : true, Content : '', Date:'7:00'},
]
export const ChatMessages = () => {


return (
    <>
    <div className={Styles.ChatMessagesContainer}>
        <div className={Styles.ChatMsginfoContainer}>
                <img src={Backarrow.src} onClick={BackarrowHandleClick}></img>
                <div className={Styles.ChatMsginfo}>
                    <div className={Styles.ChatMsgProfile} onClick={ChatMsgProfileHandleClick}>
                        <img src='https://images.saymedia-content.com/.image/c_limit%2Ccs_srgb%2Cq_auto:eco%2Cw_700/MTczOTM5NzMzODQyMzcxNjQ4/guts-a-berserk-character-analysis.webp'></img>
                        <div>
                            <div className={Styles.ChatMsgProfileName}>Abdellah Belhachmi</div>
                            <div className={Styles.ChatMsgProfileStatus}>Status</div>
                        </div>
                    </div>
                    <div className={Styles.ChatMsgSettings}>
                        <img src={ChatMsgSetting.src} alt='ChatMsgSetting'></img>
                    </div>
                </div>
        </div>
        <div className={Styles.ChatMsgList}>
            <Message {...MsgList[0]}></Message>
            <Message {...MsgList[1]}></Message>
            <Message {...MsgList[2]}></Message>
            <Message {...MsgList[3]}></Message>
            <Message {...MsgList[3]}></Message>
            <Message {...MsgList[0]}></Message>
            <Message {...MsgList[0]}></Message>
            <Message {...MsgList[3]}></Message>
            <Message {...MsgList[5]}></Message>
            <Message {...MsgList[5]}></Message>
            <Message {...MsgList[5]}></Message>
            <Message {...MsgList[5]}></Message>
            <Message {...MsgList[5]}></Message>
            <Message {...MsgList[5]}></Message>
            <Message {...MsgList[0]}></Message>
            <Message {...MsgList[6]}></Message>
        </div>
        <ChatMessageInput></ChatMessageInput>
    </div>
    </>
);
};