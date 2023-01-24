import styles from "@styles/Chat/ChatContainer.module.css";
import { ChatConversations } from "@components/Chat/ChatConversations";
import { ChatMessages } from "@components/Chat/ChatMessages";
import { useEffect, useLayoutEffect, useState } from "react";
import { conversations, initialconv, MsgData } from "@Types/dataTypes";
import { fetchDATA } from "@hooks/useFetchData";
import { useRouter } from "next/router";

const Chat = () => {
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [convs, setConvs] = useState<conversations[]>([]);
  const [convData, setConvData] = useState<conversations>(initialconv);
  const [newConv, setNewConv] = useState<conversations>(initialconv);
  const router = useRouter();

  /* -------------------------------------------------------------------------- */
  /*                             fetch conversation                             */
  /* -------------------------------------------------------------------------- */
  
  useEffect(() => {
    fetchDATA(setConvs, router, "chat/conversations");
  }, []);
  
  /* -------------------------------------------------------------------------- */
  /*                             update conversation                            */
  /* -------------------------------------------------------------------------- */

  const updateConversations = (msgConvId: string) => {
    fetchDATA(setNewConv, router, `chat/conversations/${msgConvId}`);
  };
  
  useEffect(() => {
    const convlist = convs.filter((conv) =>{
      return conv.convId !== newConv?.convId;
    });
    setConvs([newConv, ...convlist]);
  }, [newConv]);

  /* -------------------------------------------------------------------------- */
  /*                        detect if is a Mobile screen                        */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const checkMobile = () => {
      const mql = window.matchMedia("(max-width : 1024px)");
      if (mql.matches) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    window.addEventListener("resize", checkMobile);
    checkMobile();
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <div className={styles.ChatContainer}>
        <ChatConversations
          isMobile={isMobile}
          convs={convs}
          setConvData={setConvData}
          updateConversations={updateConversations}
        />
        <ChatMessages
          isMobile={isMobile}
          convData={convData}
          updateConversations={updateConversations}
        />
      </div>
    </>
  );
};
export default Chat;
