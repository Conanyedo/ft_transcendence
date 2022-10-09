import React, {
  createContext,
  useState,
  useEffect,
  SetStateAction,
  useRef,
} from "react";
import { chatMsg, chatUser } from "@Types/dataTypes";
import socket_notif from "config/socketNotif";
import { getLastConvs } from "@utils/chat";
import { getFriends } from "@hooks/useFetchData";

interface ChatContextType {
  protectedChannel: boolean;
  setProtectedChannel: React.Dispatch<React.SetStateAction<boolean>>;
  channelMode: string;
  setChannelMode: React.Dispatch<React.SetStateAction<string>>;
  lastUsers: chatUser[];
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
  setInitialUsrData: any;
  friends: any;
  convId: string;
  setConvId: any;
}

const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider = ({ children }: any) => {
  const [isUp, setisUp] = useState<boolean>(false);
  const [protectedChannel, setProtectedChannel] = useState(false);
  const [channelMode, setChannelMode] = useState<string>("");

  // Setting all the chat state here

  // const [showCnv, setShowCnv] = useState<boolean>(false);
  // const [profile, setShowprofile] = useState(false);
  // const [showSetModal, setShowSetModal] = useState(false);

  const [lastUsers, setLastUsers] = useState<Array<chatUser>>([]);

  const [friends, setFriends] = useState([]);

  const [currentUser, setCurrentUser] = useState<chatUser>(lastUsers[0]);
  const [showCnv, setShowCnv] = useState<boolean>(false);
  const [initialusrData, setInitialUsrData] = useState<Array<chatUser>>([]);
  const messagesEndRef: any = useRef(null);

  const [convId, setConvId] = useState("");

  // setting the chat users refs
  const chatUsersRefs: Array<HTMLDivElement> | any = useRef([]);
  const [prevUser, setPrevUser] = useState<number>(0);

  const [chatMsgs, setChatMsgs] = useState<any>([]);

  useEffect(() => {
    socket_notif.on("connect", () => {
    });
    getLastConvs(setLastUsers, setInitialUsrData);
    getFriends(setFriends);

    setCurrentUser(lastUsers[0]);
    setisUp(true);
    return () => {
      socket_notif.off("connect");
    };
  }, []);

  return (<>
    {isUp && <ChatContext.Provider
      value={{
        protectedChannel,
        setProtectedChannel,
        channelMode,
        setChannelMode,
        lastUsers,
        setLastUsers,
        currentUser,
        setCurrentUser,
        showCnv,
        setShowCnv,
        messagesEndRef,
        chatUsersRefs,
        prevUser,
        setPrevUser,
        initialusrData,
        chatMsgs,
        setChatMsgs,
        friends,
        setInitialUsrData,
        convId,
        setConvId,
      }}
    >
      {children}
    </ChatContext.Provider>}
  </>);
};

const withChat = (Child: any) => (props: any) =>
  (
    <ChatContext.Consumer>
      {(context) => <Child {...props} {...context} />}
      {/* Another option is:  {context => <Child {...props} context={context}/>}*/}
    </ChatContext.Consumer>
  );

export { ChatProvider, withChat, ChatContext };
export type { ChatContextType };
