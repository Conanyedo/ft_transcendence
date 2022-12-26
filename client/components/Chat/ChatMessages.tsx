import Styles from '@styles/Chat/ChatMessages.module.css';
import ChatMsgSetting from '@public/Chat/ThreeDots.svg';
import Backarrow from '@public/ArrowLeft.svg';
import { ChatMessageInput } from './ChatMessageInput';


const BackarrowHandleClick = () => {
    console.log('Back to Chat root');
}

const ChatMsgProfileHandleClick = () => {
    console.log('Go to User profile');
}

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
            MessageList
        </div>
        <ChatMessageInput></ChatMessageInput>
    </div>
    </>
);
};