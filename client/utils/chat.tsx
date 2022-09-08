import { chatUser } from "@Types/dataTypes";
import Styles from "@styles/chat.module.css"
import { InviteMsg } from "@components/Chat";

// Introducing in scope functions here
export const setMsg = (enteredMessage: string, keycode: number, setChatMsgs: Function, chatMsgs: Array<Object>, setEnteredMsg: Function) => {

    console.log("here");
    if (keycode == 13) {
        setChatMsgs([...chatMsgs, { msgContent: enteredMessage, time: "07:19 PM", type: "sender", name: "You" }]);
        setEnteredMsg("");
    }
}

export function showConversation() {
    console.log("Show");
}

export const scrollToBottom = (messagesEndRef: HTMLDivElement) => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}

export function showProfile(profile: boolean, setShowprofile: any) {
    console.log("show settings");
    console.log(profile);
    if (!profile) {
        console.log("entered here")
        setShowprofile(true);
    }
}

export const setChatUser = (user: chatUser, chatUsersRefs: Array<HTMLDivElement>, i: number, setCurrentUser: any, setPrevUser: any, setShowCnv: any, prevUser: any) => {

    // Unselect the previous user
    chatUsersRefs.current[prevUser].classList.remove(`${Styles.chatUserClicked}`);

    //Set current state of the user
    setCurrentUser(user);

    // Make the clicked div selectable
    chatUsersRefs.current[i].classList.add(`${Styles.chatUserClicked}`);
    setPrevUser(i);
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

    console.log(newUsers);
    setLastUsers(newUsers);
}