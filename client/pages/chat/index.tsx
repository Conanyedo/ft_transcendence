
import Styles from "@styles/Chat/ChatContainer.module.css";

import { ChatConversations } from "@components/Chat/ChatConversations";
import { ChatMessages } from "@components/Chat/ChatMessages";

const Chat = () => {
  return (
    <>
      <div className={Styles.chatContainer}>
        <ChatMessages></ChatMessages>
        {/* <ChatConversations></ChatConversations> */}
      </div>
    </>
  );
};
export default Chat;
