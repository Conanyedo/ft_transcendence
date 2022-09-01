import React, { createContext, useState } from "react";

interface ChatContextType {
  protectedChannel: boolean;  
  setProtectedChannel: React.Dispatch<React.SetStateAction<boolean>>;
  channelMode: string;
  setChannelMode: React.Dispatch<React.SetStateAction<string>>;
}

const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider = ({ children }: any) => {
  
  const [protectedChannel, setProtectedChannel] = useState(false);
  const [channelMode, setChannelMode] = useState<string>("Public");
  return (
    <ChatContext.Provider value={{ protectedChannel, setProtectedChannel, channelMode, setChannelMode }}>
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
