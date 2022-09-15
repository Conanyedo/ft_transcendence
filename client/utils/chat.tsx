import { chatUser } from "@Types/dataTypes";
import Styles from "@styles/chat.module.css"
import { InviteMsg } from "@components/Chat";

// Introducing in scope functions here
export const setMsg = (event: any, enteredMessage: string, setChatMsgs: Function, chatMsgs: Array<Object>, setEnteredMsg: Function) => {

    if (enteredMessage !== "" && event.keyCode == 13) {
        setChatMsgs([...chatMsgs, { msgContent: enteredMessage, time: "07:19 PM", type: "sender", name: "You" }]);
        setEnteredMsg("");
    }
}

export function showConversation() {
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
    console.log(user);

    console.log("this function is used");
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
    let newUsers: Array<chatUser> = lastUsers.filter((user: chatUser) => user?.fullName?.toUpperCase().includes(value));

    setLastUsers(newUsers);
}