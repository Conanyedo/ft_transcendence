import styles from "@styles/Chat/ChatContainer.module.css";
import { ChatConversations } from "@components/Chat/ChatConversations";
import { ChatMessages } from "@components/Chat/ChatMessages";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { conversations, MsgData } from "@Types/dataTypes";

interface members{

}


const Messages1: MsgData[] = [
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 1,
    fullName: "Choaib Abouelwafa",
    sender: true,
    gameInvite: false,
    content: "hey wp",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 2,
    fullName: "Choaib Abouelwafa",
    sender: true,
    gameInvite: false,
    content: "how r u",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 3,
    fullName: "Abdellah belhachmi",
    sender: false,
    gameInvite: false,
    content: "hey wassup",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 4,
    fullName: "Abdellah belhachmi",
    sender: false,
    gameInvite: false,
    content: "im good u?",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 5,
    fullName: "Choaib Abouelwafa",
    sender: true,
    gameInvite: false,
    content: "im fine thanks",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 6,
    fullName: "Choaib Abouelwafa",
    sender: false,
    gameInvite: true,
    content: "",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 7,
    fullName: "Choaib Abouelwafa",
    sender: true,
    gameInvite: true,
    content: "",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 8,
    fullName: "Choaib Abouelwafa",
    sender: true,
    gameInvite: true,
    content: "",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 9,
    fullName: "Choaib Abouelwafa",
    sender: true,
    gameInvite: true,
    content: "",
    date: "7:00",
  },
];

const Messages: MsgData[] = [
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 1,
    fullName: "Choaib Abouelwafa",
    sender: true,
    gameInvite: false,
    content:
      "hellooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 2,
    fullName: "Choaib Abouelwafa",
    sender: true,
    gameInvite: false,
    content: "how r u",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 3,
    fullName: "Abdellah belhachmi",
    sender: false,
    gameInvite: false,
    content: "hey wassup",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 4,
    fullName: "Abdellah belhachmi",
    sender: false,
    gameInvite: false,
    content: "im good u?",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 5,
    fullName: "Choaib Abouelwafa",
    sender: true,
    gameInvite: false,
    content: "im fine thanks",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 6,
    fullName: "Choaib Abouelwafa",
    sender: false,
    gameInvite: true,
    content: "",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 7,
    fullName: "Choaib Abouelwafa",
    sender: true,
    gameInvite: true,
    content: "",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 8,
    fullName: "Choaib Abouelwafa",
    sender: true,
    gameInvite: true,
    content: "",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 9,
    fullName: "Choaib Abouelwafa",
    sender: true,
    gameInvite: true,
    content: "",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 10,
    fullName: "Choaib Abouelwafa",
    sender: true,
    gameInvite: true,
    content: "",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 11,
    fullName: "Choaib Abouelwafa",
    sender: true,
    gameInvite: true,
    content: "",
    date: "7:00",
  },
  {
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    id: 12,
    fullName: "Choaib Abouelwafa",
    sender: true,
    gameInvite: true,
    content: "",
    date: "7:00",
  },
];

const convs: conversations[] = [
  {
    convid: 1,
    fullName: "Choaib Abouelwafa",
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    membersNum: 0,
    status: "offline",
    messages: Messages,
    read: false,
    login: "cabouelw",
    relation: "Friend",
    type: "DM",
  },
  {
    convid: 2,
    fullName: "onepiece",
    avatar: "https://i.ytimg.com/vi/Fe3M_hgEDjk/maxresdefault.jpg",
    membersNum: 10,
    status: "",
    messages: Messages1,
    read: false,
    login: "onepiece",
    relation: "Admin",
    type: "Protected",
  },
  {
    convid: 3,
    fullName: "Sakazuki Akainu",
    avatar:
      "https://i.pinimg.com/originals/2e/94/a0/2e94a0d1a109f506d542decca10af75e.jpg",
    membersNum: 0,
    status: "in Game",
    messages: [],
    read: true,
    login: "ikainu",
    relation: "Blocked",
    type: "DM",
  },
  {
    convid: 4,
    fullName: "Monkey D Luffy",
    avatar:
      "https://img.assinaja.com/upl/lojas/mundosinfinitos/imagens/foto-one-piece.png",
    membersNum: 4,
    status: "online",
    messages: [],
    read: true,
    login: "luffy",
    relation: "Owner",
    type: "Private",
  },
  {
    convid: 5,
    fullName: "Kozuki",
    avatar:
      "https://nintendoeverything.com/wp-content/uploads/OPPW4-DLC_12-10-20.jpg",
    membersNum: 0,
    status: "online",
    messages: [],
    read: true,
    login: "oden1",
    relation: "Friend",
    type: "DM",
  },
  {
    convid: 6,
    fullName: "Kozuki Oden",
    avatar:
      "https://nintendoeverything.com/wp-content/uploads/OPPW4-DLC_12-10-20.jpg",
    membersNum: 0,
    status: "online",
    messages: [],
    read: true,
    login: "oden2",
    relation: "Friend",
    type: "DM",
  },
  {
    convid: 7,
    fullName: "onepiece fans",
    avatar:
      "https://nintendoeverything.com/wp-content/uploads/OPPW4-DLC_12-10-20.jpg",
    membersNum: 4,
    status: "",
    messages: [],
    read: true,
    login: "oden3",
    relation: "Muted",
    type: "Public",
  },
  {
    convid: 8,
    fullName: "Kozuki Oden fans",
    avatar:
      "https://nintendoeverything.com/wp-content/uploads/OPPW4-DLC_12-10-20.jpg",
    membersNum: 4,
    status: "",
    messages: [],
    read: true,
    login: "oden4",
    relation: "Left",
    type: "Public",
  },
  {
    convid: 9,
    fullName: "KozukiOden Fans2",
    avatar:
      "https://nintendoeverything.com/wp-content/uploads/OPPW4-DLC_12-10-20.jpg",
    membersNum: 4,
    status: "",
    messages: [],
    read: true,
    login: "oden5",
    relation: "Banned",
    type: "Public",
  },
];

const intialconv: conversations = {
  convid: 0,
  fullName: "",
  avatar: "",
  membersNum: 0,
  messages: [],
  read: true,
  login: "",
  relation: "",
  type: "",
};

const Chat = () => {
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [selectedConv, setselectedConv] = useState<number>(0);
  const [convData, setconvData] = useState<conversations>(intialconv);
  const router = useRouter();
  
  // detect if is a Mobile screen

  useEffect(() => {
    const checkMobile = () => {
      const mql = window.matchMedia("(max-width : 1024px)");
      if (mql.matches)
      {
        setIsMobile(true);
      }
      else {
        setIsMobile(false);
      }
    };
    window.addEventListener('resize', checkMobile);
    checkMobile();
      return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // get the query from route if exist

  useEffect(() => {
    if (router.query.hasOwnProperty("id")) {
      const id = Number(router.query.id);
      setselectedConv(id);
    }
    else setselectedConv(0);
  }, [router.query]);

  useEffect(() => {
    const conv: conversations | undefined = convs.find(
      (conv) => conv.convid === selectedConv
      );
      if (conv) setconvData(conv);
      else setconvData(intialconv);
      if (selectedConv > 0)
      router.replace({ pathname: "/chat", query: { id: selectedConv } });
    }, [selectedConv]);

  console.log("root select : ",selectedConv);
  console.log("root convdata :", convData);

  return (
    <>
      <div className={styles.ChatContainer}>
        <ChatConversations
          isMobile={isMobile}
          convs={convs}
          selectedConv={selectedConv}
          setselectedConv={setselectedConv}
        />
        <ChatMessages  isMobile={isMobile} convData={convData} router={router}/>
      </div>
    </>
  );
};
export default Chat;
