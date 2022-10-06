import { chatUser } from "@Types/dataTypes";
import socket_notif from "config/socketNotif";
import { fetchDATA, fetchUserLogin, requests } from "@hooks/useFetchData";
import { InviteMsg } from "@components/Chat/inviteMsg";
import Router from "next/router";

const statuses = ["Banned", "Left", "Muted"];

// Introducing in scope functions here
export const setMsg = (keycode: any, enteredMessage: string, setEnteredMsg:any, convId: number, login: string, setStopUsr: any) => {
    
    console.log(convId);

    if (enteredMessage !== "" && keycode == 13) {
        const data = { msg: enteredMessage, convId, receiver: login }
        socket_notif.emit("sendMsg", data, (response:any) => {
            // handle msg
            if (statuses.includes(response.data)) {
                setStopUsr(response.data.toLowerCase());
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

export function sendInvite(currentUser: any, setChatMsgs: any, chatMsgs: any) {
    if (currentUser !== undefined) {
        const newMsg = { msgContent: InviteMsg(currentUser), time: "07:19 PM", type: "sender", name: "You" };
        setChatMsgs([...chatMsgs, newMsg]);
    }
}

export function filterChatUsers(value: string, searchUsrs: any, setSearchUsrs: any, initialData: any) {

    // Return to initial state
    if (value == "") {
        setSearchUsrs(initialData);
        return;
    }
    let newUsers: Array<chatUser> = searchUsrs.filter((user: chatUser) => user?.name?.toUpperCase().includes(value));

    setSearchUsrs(newUsers);
}

export function filterCnvs(data: any, filterItem: any) {
    const newData = data.filter((item: any) => item.convId != filterItem);
    return (newData);
}

export function getLastConvs(setLastUsers: any, setInitialUsrData: any) {
    
    socket_notif.emit("getConversations", (response:any) => {
        setLastUsers(response.data);
        // do some logic here
        setInitialUsrData(response.data);
      })
}

export const getLastUsers = async (setLastUsers: any, login: any, setCurrentUser: any, setChatMsgs: any, messagesEndRef: any, router: any) => {

    socket_notif.emit("getConversations", [], (response: any) => {

        if (response.data != undefined)
            setLastUsers(response.data);
            
        // handling the route login received
        if (login) {
            // check first if login exists
            let item: any = response.data.find((user: any) => user.login == login);

            if (item != undefined) {
                setCurrentUser(item);
                // get messages 
                socket_notif.emit("getMsgs", item?.convId, (response: any) => {
                    setChatMsgs(response.data);
                    // run on first render only
                    scrollToBottom(messagesEndRef);
                })

            } else {
                // if user doesnt exist start a new converation
                fetchUserLogin(setCurrentUser, router, login);
                setChatMsgs([]);
            }
        }
    })
}

export const setConvStatus = (currentUser: any, setStopUsr: any) => {

    if (["Muted", "Left", "Banned"].includes(currentUser?.relation)) {
        setStopUsr(currentUser.relation.toLowerCase());
    } else {
        setStopUsr("");
    }
}

// block and unblock user utils

export async function BlockFriend(currentUser: any, setRelation: any) {
    let result = await requests(
      currentUser?.login,
      "friendship/blockUser",
      Router
    );

    if (result == true) {
      setRelation("Blocker");
      Router.push(`/chat?login=${currentUser?.login}`);
    }
  }

export async function UnblockFriend(currentUser: any, setRelation: any) {
    let result = await requests(
      currentUser?.login,
      "friendship/unblock",
      Router
    );

    if (result == true) {
      setRelation("Friend");
      Router.push(`/chat?login=${currentUser?.login}`);
    }
  }