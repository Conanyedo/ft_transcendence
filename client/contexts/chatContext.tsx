import React, { createContext, useState } from "react";

interface ChatContextType {
  protectedChannel: boolean;  
  setProtectedChannel: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextType | null>(null);

const ChatProvider = ({ children }: any) => {
  
  const [protectedChannel, setProtectedChannel] = useState(false);
  return (
    <ChatContext.Provider value={{ protectedChannel, setProtectedChannel }}>
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
