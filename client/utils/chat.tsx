import { chatUser } from "@Types/dataTypes";
import Styles from "@styles/chat.module.css"
import { InviteMsg } from "@components/Chat";

import socket_notif from "config/socketNotif";

const statuses = ["Banned", "Left", "Muted"];

// Introducing in scope functions here
export const setMsg = (keycode: any, enteredMessage: string, setEnteredMsg:any, convId: number, login: string, setStopUsr: any) => {
    
    if (enteredMessage !== "" && keycode == 13) {
        const data = { msg: enteredMessage, convId, receiver: login }
        socket_notif.emit("sendMsg", data, (response:any) => {
            // handle msg
            if (statuses.includes(response)) {
                setStopUsr(response.toLowerCase());
            }
            // Add chat msg here
            
        })
        
    }
}

export const scrollToBottom = (messagesEndRef: any) => {
    const element = messagesEndRef.current;
    if (element !== null)
        element.scrollIntoView({ behavior: "smooth" });
}

export function showProfile(profile: boolean, setShowprofile: any) {
    if (!profile) {
        setShowprofile(true);
    }
}

export const setChatUser = (user: chatUser, setShowCnv: any) => {

    //Set current state of the user
    setShowCnv(true);
}


export function sendInvite(currentUser: any, setChatMsgs: any, chatMsgs: any) {
    if (currentUser !== undefined) {
        const newMsg = { msgContent: InviteMsg(currentUser), time: "07:19 PM", type: "sender", name: "You" };
        setChatMsgs([...chatMsgs, newMsg]);
    }
}

export function filterChatUsers(e: React.ChangeEvent<HTMLInputElement>, lastUsers: any, setLastUsers: any, initialUsersState: any) {
    let value = e.target.value.toUpperCase();

    // Return to initial state
    if (value == "") {
        setLastUsers(initialUsersState);
        return;
    }
    let newUsers: Array<chatUser> = lastUsers.filter((user: chatUser) => user?.name?.toUpperCase().includes(value));

    setLastUsers(newUsers);
}

export function filterCnvs(data: any, filterItem: any) {
    const newData = data.filter((item: any) => item.convId != filterItem);
    return (newData);
}

export function getLastConvs(setLastUsers: any, setInitialUsrData: any) {
    
    socket_notif.emit("getConversations", (response:any) => {
        setLastUsers(response);
        // do some logic here
        setInitialUsrData(response);
      })
}