import { chatUser } from "@Types/dataTypes";
import Styles from "@styles/chat.module.css"
import Image from "next/image";

export function InviteMsg(invitedUser: chatUser) {
    return (<div className={Styles.inviteMsg}>
        <div>
            <Image src={invitedUser?.avatar} width={38} height={38} className={Styles.inviteAvatar} />
            <div>
                {invitedUser.name}
                <p>You invite them to play pong game</p>
            </div>
        </div>
        <button className={Styles.inviteBtn}>Cancel Invitation</button>
    </div>)
}