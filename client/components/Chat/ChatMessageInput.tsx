import Styles from '@styles/Chat/ChatMessageInput.module.css'
import SendMsgIcon from '@public/Chat/send-arrow.svg';
import InviteGameicon from '@public/Chat/Gamepad.svg';
import { useState } from 'react';

export const ChatMessageInput = () => {
    const [isTyping, setisTyping] = useState(false);

    const isTypingHandler = () => {
        setisTyping(true);
    };

    if (isTyping)
        return (
            <>
            <div className={Styles.ChatMsgSendBoxContainer}>
                <div className={Styles.ChatMsgSendBox}>
                    <input type={'text'} placeholder='Message'></input>
                    <img src={InviteGameicon.src} alt='SendMsgicon'></img>
                </div>
                <img src={SendMsgIcon.src} alt='SendMsgIcon'></img>
            </div>
            </>
        );
    return (
        <>
            <div className={Styles.ChatMsgSendBoxContainer}>
            <div className={Styles.ChatMsgSendBox}>
                <input type={'text'} placeholder='Message' onInput={isTypingHandler}></input>
                <img src={InviteGameicon.src} alt='SendMsgicon'></img>
            </div>
        </div>
        </>
    );
};
