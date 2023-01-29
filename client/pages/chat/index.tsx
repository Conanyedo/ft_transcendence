import styles from "@styles/Chat/ChatContainer.module.css";
import { ChatConversations } from "@components/Chat/ChatConversations";
import ChatMessages from "@components/Chat/ChatMessages";
import { useEffect, useLayoutEffect, useState } from "react";
import { conversations, initialconv, MsgData } from "@Types/dataTypes";
import { fetchDATA, fetchLoginInfo } from "@hooks/useFetchData";
import { useRouter } from "next/router";

const Chat = () => {
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [convs, setConvs] = useState<conversations[]>([]);
  const [convData, setConvData] = useState<conversations>(initialconv);
  const [newConv, setNewConv] = useState<conversations>(initialconv);
  const router = useRouter();

  /* -------------------------------------------------------------------------- */
  /*                             update conversation                            */
  /* -------------------------------------------------------------------------- */

  const updateConversations = (msgConvId: string) => {
    if (msgConvId)
      fetchDATA(setNewConv, router, `chat/conversations/${msgConvId}`);
  };

  /* -------------------------------------------------------------------------- */
  /*                              check login info                              */
  /* -------------------------------------------------------------------------- */

  const getSelectConvId = () => {
    if (router.query.login) return router.query.login as string;
    else if (router.query.channel) return router.query.channel as string;
    else return "0";
  };
  const checkLoginInfo = async () => {
    const convId = getSelectConvId();

    const loginInfo =
      convId !== "0" && !convId.includes("-")
        ? await fetchLoginInfo(convId)
        : undefined;
    if (loginInfo)
      setConvData({ name: loginInfo.fullname, type: "Dm", ...loginInfo });
  };

  /* -------------------------------------------------------------------------- */
  /*                             fetch conversation                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    fetchDATA(setConvs, router, "chat/conversations");
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

  useEffect(() => {
    const convlist: conversations[] = [];
    if (newConv.convId !== "0") {
      const oldConv = convs.find((conv) => conv.convId === newConv.convId);
      if (
        newConv.status === "Blocker" ||
        (oldConv?.status === "Blocker" && newConv.status !== "Blocker")
      ) {
        convs.map((conv) => {
          if (conv.convId === newConv?.convId) convlist.push(newConv);
          else convlist.push(conv);
        });
        setConvs(convlist);
      } else {
        convs.map((conv) => {
          if (conv.convId !== newConv?.convId) convlist.push(conv);
        });
        setConvs([newConv, ...convlist]);
      }
    }
  }, [newConv]);

  /* -------------------------------------------------------------------------- */
  /*                             check if conv exist                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const convId = getSelectConvId();
    if ((convs.length > 0 && convId !== "0") || convId !== "0") {
      let foundconv = convs.find(
        (conv) => conv.convId === convId || conv.login === convId
      );
      if (foundconv) setConvData(foundconv);
      else checkLoginInfo();
    } else if (convId === "0") setConvData(initialconv);
  }, [router.query, convs]);

  return (
    <>
      <div className={styles.ChatContainer}>
        <ChatConversations
          isMobile={isMobile}
          convs={convs}
          selectedConv={getSelectConvId()}
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
