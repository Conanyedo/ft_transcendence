import { chatUser } from "@Types/dataTypes";
import socket_notif from "config/socketNotif";
import { fetchUserLogin, requests } from "@hooks/useFetchData";
import { InviteMsg } from "@components/Chat/inviteMsg";
import Router from "next/router";
import { updateChnlInfo } from "../customHooks/useFetchData";

const statuses = ["Banned", "Left", "Muted"];

export const setMsg = (
  keycode: any,
  enteredMessage: string,
  currentUser: any,
  setStopUsr: any
) => {
  if (enteredMessage !== "" && keycode == 13) {
    const data = {
      msg: enteredMessage,
      convId: currentUser.convId,
      receiver: currentUser.login,
    };
    socket_notif.emit("sendMsg", data, (response: any) => {
      if (statuses.includes(response.data.err)) {
        setStopUsr(response.data.err.toLowerCase());
      } else if (response.data !== "") {
        if (!currentUser.convId) {
          Router.push("/chat");
          setTimeout(() => {
            Router.push("/chat?login=" + currentUser.login);
          }, 90);
        }
      }
    });
  }
};

export const scrollToBottom = (messagesEndRef: any) => {
  const element = messagesEndRef.current;
  if (element !== null) element.scrollIntoView({ behavior: "smooth" });
};

export function showProfile(profile: boolean, setShowprofile: any) {
  if (!profile) {
    setShowprofile(true);
  }
}

export function sendInvite(currentUser: any, setChatMsgs: any, chatMsgs: any) {
  if (currentUser !== undefined) {
    const newMsg = {
      msgContent: InviteMsg(currentUser),
      time: "07:19 PM",
      type: "sender",
      name: "You",
    };
    setChatMsgs([...chatMsgs, newMsg]);
  }
}

export function filterChatUsers(
  value: string,
  searchUsrs: any,
  setSearchUsrs: any,
  initialData: any
) {
  value = value.toUpperCase();
  // Return to initial state
  if (value == "") {
    setSearchUsrs(initialData);
    return;
  }
  let newUsers: Array<chatUser> = searchUsrs.filter((user: chatUser) =>
    user?.name?.toUpperCase().includes(value)
  );

  setSearchUsrs(newUsers);
}

export function filterCnvs(data: any, filterItem: any) {
  const newData = data.filter((item: any) => item.convId != filterItem);
  return newData;
}

export function getLastConvs(setLastUsers: any, setInitialUsrData: any) {
  socket_notif.emit("getConversations", (response: any) => {
    setLastUsers(response.data);
    // do some logic here
    setInitialUsrData(response.data);
  });
}

export const getLastUsers = async (
  setLastUsers: any,
  login: any,
  setCurrentUser: any,
  setChatMsgs: any,
  messagesEndRef: any,
  router: any
) => {
  socket_notif.emit("getConversations", [], (response: any) => {
    if (response.data != undefined) setLastUsers(response.data);

    // handling the route login received
    if (login) {
      // check first if login exists
      let item: any = response.data.find((user: any) => user.login == login);

      if (item != undefined) {
        setCurrentUser(item);
        // get messages
        socket_notif.emit(
          "getMsgs",
          { convId: item?.convId },
          (response: any) => {
            console.table(response.data);
            
            setChatMsgs(response.data);
            // run on first render only
            scrollToBottom(messagesEndRef);
          }
        );
      } else {
        // if user doesnt exist start a new converation
        fetchUserLogin(setCurrentUser, router, login);
        setChatMsgs([]);
      }
    }
  });
};

export const setConvStatus = (currentUser: any, setStopUsr: any) => {
  if (["Muted", "Left", "Banned"].includes(currentUser?.relation)) {
    setStopUsr(currentUser.relation.toLowerCase());
  } else {
    setStopUsr("");
  }
};

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
  let result = await requests(currentUser?.login, "friendship/unblock", Router);

  if (result == true) {
    setRelation("Friend");
    Router.push(`/chat?login=${currentUser?.login}`);
  }
}

function errorHandler(values: any, data: any) {
  if (
    !RegExp(
      /^(?=.{2,20}$)(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/
    ).test(values.cName)
  ) {
	console.log(values.cName);
    return "Channel name shouldbe between 3 to 20 characters and can contain one of these: [space_.-].";
  }
  if (
    values.type == "Protected" &&
    !RegExp(
      /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/
    ).test(values.password)
  ) {
    return "Password must contain at least 8 characters.At least one number, one uppercase letter and one special character";
  }
  if (values.cName.length == 0 || data.oldPath == "")
    return "There is a missing input.";
  return "";
}

export function updateChannel(
  values: any,
  data: any,
  currUser: any,
  router: any,
  setshowModal: any,
  setErrorMsg: any
) {
  let res = errorHandler(values, data);
  if (res == "") {
    const formData = new FormData();
    formData.append("convId", currUser.convId);
    formData.append("name", values.cName);
    formData.append("type", values.type);
    if (values.type == "Protected")
      formData.append("password", values.password);
    if (data.avatar != "") formData.append("avatar", data.avatar);
    formData.append("oldPath", data.oldPath);
    updateChnlInfo(formData, router, values.cName);
    setshowModal(false);
  } else {
    setErrorMsg(res);
  }
}
