import axios from "axios";
import React, { createContext, useState, useEffect, SetStateAction, useRef } from "react";
import { chatMsg, chatUser } from "@Types/dataTypes"
import Avatar from "@public/profile.jpg"

interface ChatContextType {
  protectedChannel: boolean;  
  setProtectedChannel: React.Dispatch<React.SetStateAction<boolean>>;
  channelMode: string;
  setChannelMode: React.Dispatch<React.SetStateAction<string>>;
  lastUsers:chatUser[];
  setLastUsers: React.Dispatch<SetStateAction<chatUser[]>>;
  initialUsersState:chatUser[] | undefined;
  currentUser: chatUser | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<chatUser>>;
  showCnv: boolean;
  setShowCnv: React.Dispatch<React.SetStateAction<boolean>>;
  chatMsgs: Array<chatMsg>;
  setChatMsgs: React.Dispatch<React.SetStateAction<chatMsg[]>>;
  messagesEndRef: any;
  chatUsersRefs: any;
  prevUser: number;
  setPrevUser: React.Dispatch<React.SetStateAction<number>>;
}

const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider = ({ children }: any) => {
  
  const [protectedChannel, setProtectedChannel] = useState(false);
  const [channelMode, setChannelMode] = useState<string>("Public");

  // Setting all the chat state here

  // Setting ChatLeft state variables here s

  // const [showCnv, setShowCnv] = useState<boolean>(false);
	const [profile, setShowprofile] = useState(false);
	const [showSetModal, setShowSetModal] = useState(false);

  const [initialUsersState, setInitialUsersState] = useState<Array<chatUser>>([
		{ id: 0, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Online" },
		{ id: 1, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "In Game" },
		{ id: 2, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Offline" },
		{ id: 3, imgSrc: Avatar, fullName: "Chouaib Elwafa", status: "Offline" },
		{ id: 4, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "In Game" },
		{ id: 5, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Offline" },
		{ id: 6, imgSrc: Avatar, fullName: "Wafa cash", status: "Online" },
		{ id: 7, imgSrc: Avatar, fullName: "Youness Bouddou", status: "Online" },
		{ id: 8, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "In Game" },
		{ id: 9, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Online" },
		{ id: 10, imgSrc: Avatar, fullName: "Abdellah Belhachmi", status: "Offline" },
		{ id: 10, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Offline" },
		{ id: 10, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Offline" },
		{ id: 10, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Offline" },
		{ id: 10, imgSrc: Avatar, fullName: "Ikram Kharbouch", status: "Offline" },
		{ id: 10, imgSrc: Avatar, fullName: "Oussama Oussama", status: "Offline" }
	]);
  const [lastUsers, setLastUsers] = useState<Array<chatUser>>(initialUsersState);
  const [currentUser, setCurrentUser] = useState<chatUser>(lastUsers[0]);
  const [showCnv, setShowCnv] = useState<boolean>(false);
  const [chatMsgs, setChatMsgs] = useState<Array<chatMsg>>([
		{ msgContent: "Test1", time: "07:19 PM", type: "sender", name: "You" },
		{ msgContent: "Test2", time: "07:19 PM", type: "receiver", name: "Ikram Kharbouch" },
		{ msgContent: "Test3", time: "07:19 PM", type: "sender", name: "You" }
	]);

  const messagesEndRef: any = useRef(null);

  // setting the chat users refs
  const chatUsersRefs: Array<HTMLDivElement> | any = useRef([]);
  const [prevUser, setPrevUser] = useState<number>(0);

  useEffect(() => {
    setCurrentUser(lastUsers[0]);
  }, [lastUsers])

  return (
    <ChatContext.Provider value={{ protectedChannel, setProtectedChannel, channelMode, setChannelMode, lastUsers, setLastUsers, initialUsersState, currentUser, setCurrentUser, showCnv, setShowCnv, chatMsgs, setChatMsgs, messagesEndRef, chatUsersRefs, prevUser, setPrevUser }}>
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
