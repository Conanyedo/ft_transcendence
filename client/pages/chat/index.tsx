import styles from "@styles/Chat/ChatContainer.module.css";
import { ChatConversations } from "@components/Chat/ChatConversations";
import { ChatMessages } from "@components/Chat/ChatMessages";
import { useEffect, useLayoutEffect, useState } from "react";
import { conversations, initialconv, MsgData } from "@Types/dataTypes";
import { fetchDATA, fetchLoginInfo } from "@hooks/useFetchData";
import { useRouter } from "next/router";

const Chat = () => {
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [convs, setConvs] = useState<conversations[]>([]);
  const [convData, setConvData] = useState<conversations>(initialconv);
  const [newConv, setNewConv] = useState<conversations>(initialconv);
  const [isDirectMsg, setIsDirectMsg] = useState<boolean>(false);
  const [selectedConv, setselectedConv] = useState<string | string[]>("0");
  const router = useRouter();

  /* -------------------------------------------------------------------------- */
  /*                             update conversation                            */
  /* -------------------------------------------------------------------------- */

  const updateConversations = (msgConvId: string) => {
    fetchDATA(setNewConv, router, `chat/conversations/${msgConvId}`);
  };

  /* -------------------------------------------------------------------------- */
  /*                              check login info                              */
  /* -------------------------------------------------------------------------- */

  const checkLoginInfo = async () => {
    const loginInfo = await fetchLoginInfo(selectedConv);
    if (loginInfo) {
      setIsDirectMsg(true);
      setConvData({ name: loginInfo.fullname, type: "Dm", ...loginInfo });
    }
    // } else setConvData(initialconv);
  };

  /* -------------------------------------------------------------------------- */
  /*                      get the query from route if exist                     */
  /* -------------------------------------------------------------------------- */

  useLayoutEffect(() => {
    if (router.query.login) {
      const id = router.query.login;
      setselectedConv(id); // id type string | string[]
    } else if (router.query.channel) {
      const id = router.query.channel;
      setselectedConv(id);
    } else {
      setselectedConv("0");
      setConvData(initialconv);
    }
  }, [router.query]);

  /* -------------------------------------------------------------------------- */
  /*                             fetch conversation                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    fetchDATA(setConvs, router, "chat/conversations");
  }, []);

  useEffect(() => {
    const convlist = convs.filter((conv) => {
      return conv.convId !== newConv?.convId;
    });
    setConvs([newConv, ...convlist]);
    if (isDirectMsg && newConv.convId) {
      setselectedConv(newConv.convId);
      setIsDirectMsg(false);
    }
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

  /* -------------------------------------------------------------------------- */
  /*                             check if conv exist                            */
  /* -------------------------------------------------------------------------- */

  useLayoutEffect(() => {
    
    if (convs.length > 0 && selectedConv !== "0") {
      let foundconv = convs.find(
        (conv) => conv.convId === selectedConv || conv.login === selectedConv
      );
      if (foundconv) {
        setConvData(foundconv);
      } else {
        console.log("conv not exist");
        checkLoginInfo();
      }
    }
  }, [selectedConv, convs]);

  /* -------------------------------------------------------------------------- */
  /*                    change route depends on selected conv                   */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (selectedConv !== "0")
      convData.type === "Dm"
        ? router.replace({
            pathname: `/chat`,
            query: { login: selectedConv },
          })
        : router.replace({
            pathname: `/chat`,
            query: { channel: selectedConv },
          });
  }, [convData]);

  return (
    <>
      <div className={styles.ChatContainer}>
        <ChatConversations
          isMobile={isMobile}
          convs={convs}
          setConvData={setConvData}
          setIsDirectMsg={setIsDirectMsg}
          selectedConv={selectedConv}
          updateConversations={updateConversations}
          setselectedConv={setselectedConv}
        />
        <ChatMessages
          isMobile={isMobile}
          convData={convData}
          isDirectMsg={isDirectMsg}
          updateConversations={updateConversations}
        />
      </div>
    </>
  );
};
export default Chat;
