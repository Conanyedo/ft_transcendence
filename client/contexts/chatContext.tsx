import React, { createContext, useState, useEffect, SetStateAction, useRef, useMemo } from "react";
import { chatMsg, chatUser } from "@Types/dataTypes"
import socket_notif from "config/socketNotif";

interface ChatContextType {
  protectedChannel: boolean;  
  setProtectedChannel: React.Dispatch<React.SetStateAction<boolean>>;
  channelMode: string;
  setChannelMode: React.Dispatch<React.SetStateAction<string>>;
  lastUsers:chatUser[];
  setLastUsers: React.Dispatch<SetStateAction<chatUser[]>>;
  currentUser: chatUser | undefined;
  setCurrentUser: any;
  showCnv: boolean;
  setShowCnv: React.Dispatch<React.SetStateAction<boolean>>;
  chatMsgs: Array<chatMsg>;
  setChatMsgs: React.Dispatch<React.SetStateAction<chatMsg[]>>;
  messagesEndRef: any;
  chatUsersRefs: any;
  prevUser: number;
  setPrevUser: React.Dispatch<React.SetStateAction<number>>;
  initialusrData: any;
}

const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider = ({ children }: any) => {
  
  const [protectedChannel, setProtectedChannel] = useState(false);
  const [channelMode, setChannelMode] = useState<string>("Public");

  // Setting all the chat state here

  // const [showCnv, setShowCnv] = useState<boolean>(false);
	// const [profile, setShowprofile] = useState(false);
	// const [showSetModal, setShowSetModal] = useState(false);

  const [lastUsers, setLastUsers] = useState<Array<chatUser>>([]);

  const [currentUser, setCurrentUser] = useState<chatUser>(lastUsers[0]);
  const [showCnv, setShowCnv] = useState<boolean>(false);
  const [initialusrData, setInitialUsrData] = useState<Array<chatUser>>([]);
  const messagesEndRef: any = useRef(null);

  // setting the chat users refs
  const chatUsersRefs: Array<HTMLDivElement> | any = useRef([]);
  const [prevUser, setPrevUser] = useState<number>(0);

  const [chatMsgs, setChatMsgs] = useState<any>([{ msg: "testmsg", sender: "ikrkharb", date: "2022-09-20T17:04:06.792Z", convId: "a3f392e8-c6de-471b-bc71-3105a14b5998" }]);

  useEffect(() => {

    socket_notif.on("connect", () => {
			console.log(socket_notif.id);
		});

    socket_notif.emit("getConversations", (response:any) => {
      setLastUsers(response);
      setInitialUsrData(response);
    })

    setCurrentUser(lastUsers[0]);
    return () => {
      socket_notif.off('connect');
    }
  }, [])

  return (
    <ChatContext.Provider value={{ protectedChannel, setProtectedChannel, channelMode, setChannelMode, lastUsers, setLastUsers, currentUser, setCurrentUser, showCnv, setShowCnv, messagesEndRef, chatUsersRefs, prevUser, setPrevUser, initialusrData, chatMsgs, setChatMsgs }}>
      {children}
    </ChatContext.Provider>
  );
};

const withChat = (Child: any) => (props: any) => (
  <ChatContext.Consumer>
    {(context) => <Child {...props} {...context} />}
    {/* Another option is:  {context => <Child {...props} context={context}/>}*/}
  </ChatContext.Consumer>
);

export { ChatProvider, withChat, ChatContext };
export type { ChatContextType };
