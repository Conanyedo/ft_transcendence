import { MembersModal } from "@components/MembersModal";
import { SettingsModal } from "@components/SettingsModal";
import { leaveChannel, requests } from "@hooks/useFetchData";
import Styles from "@styles/chat.module.css";
import {
  getLastConvs,
  getLastUsers,
  scrollToBottom,
  sendInvite,
  setConvStatus,
  setMsg,
  showProfile,
} from "@utils/chat";
import socket_notif from "config/socketNotif";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import arrowBack from "@public/arrow-back.svg";
import { ChatContext, ChatContextType } from "@contexts/chatContext";
import Image from "next/image";
import { BackArrow } from "@svg/index";
import { MenuAsset } from "@svg/index";
import { MenuDropdown } from "./MenuDropdown";
import { GameIconAsset } from "@svg/index";
import sendArrow from "@public/send-arrow.svg";
import { Profile } from "./Profile";
import { getImageBySize } from "@hooks/Functions";
import SettingGame from "@components/game/settingGame";

// Splitting components

const SendMsg: React.FunctionComponent<{
  currentUser: any;
  relation: string;
  stopUsr: string;
  setStopUsr: any;
  enteredMsg: string;
  setEnteredMsg: any;
}> = ({
  currentUser,
  relation,
  stopUsr,
  setStopUsr,
  enteredMsg,
  setEnteredMsg,
}) => {
  const [settingGames, ShowSettingGames] = useState(false);

  function hideSettingGame() {
    ShowSettingGames(!settingGames);
  }

  return (
    <>
      {settingGames && (
        <SettingGame Hide={hideSettingGame} login={currentUser?.login} />
      )}
      <div
        className={Styles.sendDiv}
        style={{ gap: enteredMsg != "" ? "1.5rem" : "0" }}
      >
        {stopUsr == "" && relation == "Blocker" && (
          <div className={Styles.msgInput}>
            <div className={Styles.newCnv}>You blocked this user</div>
          </div>
        )}
        {stopUsr == "" && relation != "Blocker" && (
          <div className={Styles.msgInput}>
            <input
              type="text"
              placeholder="message"
              value={enteredMsg}
              onChange={(e) => setEnteredMsg(e.target.value)}
              onKeyDown={(event) =>
                setMsg(
                  event.keyCode,
                  enteredMsg,
                  setEnteredMsg,
                  currentUser.convId,
                  currentUser.login,
                  setStopUsr
                )
              }
            />
            {(currentUser?.type == "Dm" || relation == "friend") && (
              <div onClick={hideSettingGame} className={Styles.console}>
                <GameIconAsset color="#D9D9D9" />
              </div>
            )}
          </div>
        )}
        {stopUsr == "left" && currentUser.type != "Dm" && (
          <div className={Styles.msgInput}>
            <div className={Styles.newCnv}>You left this channel</div>
          </div>
        )}
        {["banned", "muted"].includes(stopUsr) && currentUser.type != "Dm" && (
          <div className={Styles.msgInput}>
            <div className={Styles.newCnv}>
              You were {stopUsr} from this channel
            </div>
          </div>
        )}
        {stopUsr == "" && relation != "Blocker" && (
          <div
            onClick={(e) =>
              setMsg(
                13,
                enteredMsg,
                setEnteredMsg,
                currentUser.convId,
                currentUser.login,
                setStopUsr
              )
            }
            className={Styles.sendCtr}
          >
            {enteredMsg && (
              <Image
                src={sendArrow}
                width={30}
                height={30}
                className={Styles.animatedBtn}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

const ChatSection: React.FC<{
  children: JSX.Element;
  currentUser: any;
  profile: any;
  msgsDisplayDiv: any;
  chatMsgs: any;
  fconvId: string;
  setFConfId: any
  convId: string,
  me: string;
  messagesEndRef: any;
}> = ({
  children,
  currentUser,
  profile,
  msgsDisplayDiv,
  chatMsgs,
  fconvId,
  setFConfId,
  convId,
  me,
  messagesEndRef,
}) => {

    useEffect(() => {
        setFConfId(convId);
    }, [convId])

    useEffect(() => {
    }, [fconvId])
    

    
  return (
    <>
      {currentUser && !profile && (
        <div className={Styles.chatSection}>
          <div className={Styles.msgsDisplay} ref={msgsDisplayDiv}>
            {chatMsgs.map((chatMsg: any, i: any) => (
              <div
                key={i}
                className={Styles.chatMsg}
                style={{
                  left: chatMsg.sender == me ? "auto" : "0",
                  right: chatMsg.sender != me ? "auto" : "0",
                }}
              >
                {(chatMsg.convId == convId ||
                  fconvId == chatMsg.convId) && (
                  <div
                    className={Styles.msgBox}
                    style={{
                      justifyContent:
                        chatMsg.sender == me ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      ref={messagesEndRef}
                      className={Styles.msgContent}
                      style={{
                        backgroundColor:
                          chatMsg.sender == me ? "#409CFF" : "#3A3A3C",
                        borderRadius:
                          chatMsg.sender == me
                            ? "5px 5px 0 5px"
                            : "0 5px 5px 5px",
                      }}
                    >
                      {chatMsg.msg}
                    </div>
                  </div>
                )}
                {(convId == chatMsg.convId ||
                  fconvId == chatMsg.convId) && (
                  <div
                    className={Styles.msgTime}
                    style={{
                      justifyContent:
                        chatMsg.sender == me ? "flex-end" : "flex-start",
                    }}
                  >
                    {chatMsg?.date?.substring(16, 11)}
                    {chatMsg?.createDate?.substring(16, 11)}
                  </div>
                )}
              </div>
            ))}
          </div>
          {children}
        </div>
      )}
    </>
  );
};

const THeader: React.FunctionComponent<{
  profile: any;
  setShowprofile: any;
  currentUser: any;
  relation: any;
  setRelation: any;
  setShowSetModal: any;
}> = ({
  profile,
  setShowprofile,
  currentUser,
  relation,
  setRelation,
  setShowSetModal,
}) => {
  // context here
  const { setShowCnv } = useContext(ChatContext) as ChatContextType;

  // state here
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const router = useRouter();

  // functions here
  const unshowCnv = () => {
    setShowCnv(false);
    router.push("/chat");
  };

  function showUsrMenu() {
    setShowMenuDropdown(!showMenuDropdown);
  }

  const goToUserProfile = (login: string) => {
    router.push(`/profile/${login}`);
  };

  async function BlockFriend() {
    let result = await requests(
      currentUser?.login,
      "friendship/blockUser",
      router
    );

    if (result == true) {
      setRelation("Blocker");
      router.push(`/chat?login=${currentUser?.login}`);
    }
  }

  async function UnblockFriend() {
    let result = await requests(
      currentUser?.login,
      "friendship/unblock",
      router
    );

    if (result == true) {
      setRelation("Friend");
      router.push(`/chat?login=${currentUser?.login}`);
    }
  }

  return (
    <div className={Styles.topDetails}>
      <div className={Styles.flex}>
        <div className={Styles.arrowAsset}>
          <Image src={arrowBack} width={16} height={16} onClick={unshowCnv} />
        </div>

        {profile && (
          <div
            className={Styles.backArrowProfile}
            onClick={() => setShowprofile(false)}
          >
            <BackArrow />
          </div>
        )}

        <div
          onClick={
            currentUser?.membersNum
              ? () => showProfile(profile, setShowprofile)
              : () => goToUserProfile(currentUser?.login)
          }
          className={Styles.flex}
        >
          <div className={Styles.avatarProps}>
            <img
              src={
                currentUser?.avatar?.startsWith("https")
                  ? currentUser?.avatar
                  : getImageBySize(currentUser?.avatar, 70)
              }
            />
          </div>
          <div>
            <h1 className={Styles.chatUsername}>
              {currentUser?.name ? currentUser.name : currentUser?.fullname}
            </h1>
            <p className={Styles.chatUserStatus}>
              {currentUser?.membersNum
                ? currentUser?.membersNum + " members"
                : currentUser?.status}
            </p>
          </div>
        </div>
      </div>
      <div className={Styles.menu} onClick={showUsrMenu}>
        <MenuAsset />
        {showMenuDropdown && (
          <MenuDropdown
            content={
              currentUser?.type == "Dm"
                ? relation != "Blocker"
                  ? [, "Block User"]
                  : [, "Unblock User"]
                : ["Settings", "Leave Channel"]
            }
            functions={[
              () => setShowSetModal(true),
              relation != "Blocker"
                ? () => BlockFriend()
                : () => UnblockFriend(),
            ]}
            id={""}
          />
        )}
      </div>
    </div>
  );
};

export const ChatRight = (props: { setShowSetModal: any; login: number }) => {
  const {
    showCnv,
    setShowCnv,
    messagesEndRef,
    chatMsgs,
    setChatMsgs,
    setLastUsers,
    lastUsers,
    setInitialUsrData,
    convId, setConvId
  } = useContext(ChatContext) as ChatContextType;

  // Setting some local state
  const [profile, setShowprofile] = useState(false);
  const [me, setMe] = useState(localStorage.getItem("owner"));

  // Settings and members modal show state
  const [showSetModal, setShowSetModal] = useState(false);
  const [membersMdl, showMembersMdl] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>();
  const [stopUsr, setStopUsr] = useState("");

  const [enteredMsg, setEnteredMsg] = useState("");
  const [relation, setRelation] = useState("");

  const router = useRouter();

  // refs
  const msgsDisplayDiv = useRef<any>();
  const token = getCookie("jwt");

  // UseEffect here
  useEffect(() => {
    getLastUsers(
      setLastUsers,
      props.login,
      setCurrentUser,
      setChatMsgs,
      messagesEndRef,
      router
    );
    // lets make an asychronous call here
    if (props.login !== undefined) {
      setShowCnv(true);
      setConvId(currentUser?.convId);
      setRelation(currentUser?.relation);
      setConvStatus(currentUser, setStopUsr);
      if (profile) setShowprofile(false);
    } else if (props.login == undefined) {
      setCurrentUser(undefined);
      router.push("/chat");
    }

    // run on first render only
    scrollToBottom(messagesEndRef);
  }, [props.login]);

  useEffect(() => {
    // listening for new messages
    socket_notif.on("newMsg", (response) => {
      setChatMsgs([...chatMsgs, response] as any);
      setFConfId(response?.convId);
      setEnteredMsg("");
      setConvStatus(currentUser, setStopUsr);
      // reset the conversations
      getLastConvs(setLastUsers, () => null);
      scrollToBottom(messagesEndRef);
    });

    return () => {
      socket_notif.off("newMsg");
    };
  }, [chatMsgs]);

  const [fconvId, setFConfId] = useState<any>();

  useEffect(() => {
    if (currentUser?.convId == undefined) {
      lastUsers.forEach((user) => {
        if (
          user?.login == currentUser?.login &&
          user?.login !== null &&
          currentUser?.login == undefined
        ) {
          setCurrentUser(user);
          setRelation(user?.relation);
        }
      });
    }
  }, [lastUsers]);

  useEffect(() => {
    setConvStatus(currentUser, setStopUsr);
    setConvId(currentUser?.convId);
    setRelation(currentUser?.relation);
  }, [currentUser]);

  return (
    <div className={`${Styles.chatRight} ${showCnv ? Styles.displayChat : ""}`}>
      <MembersModal
        showSetModal={membersMdl}
        setShowSetModal={showMembersMdl}
        convId={currentUser?.convId}
      />
      <SettingsModal
        showSetModal={showSetModal}
        setShowSetModal={setShowSetModal}
        data={currentUser}
      />
      {currentUser && (
        <div className={`${Styles.rightContent}`}>
          {currentUser && (
            <>
              <THeader
                profile={profile}
                setShowprofile={setShowprofile}
                currentUser={currentUser}
                relation={relation}
                setRelation={setRelation}
                setShowSetModal={setShowSetModal}
              />
              {profile && (
                <Profile
                  login={currentUser.login}
                  setShowSetModal={showMembersMdl}
                  convId={currentUser.convId}
                  status={currentUser.status}
                />
              )}
              <ChatSection
                children={
                  <SendMsg
                    currentUser={currentUser}
                    relation={relation}
                    stopUsr={stopUsr}
                    setStopUsr={setStopUsr}
                    enteredMsg={enteredMsg}
                    setEnteredMsg={setEnteredMsg}
                  />
                }
                currentUser={currentUser}
                profile={profile}
                msgsDisplayDiv={msgsDisplayDiv}
                chatMsgs={chatMsgs}
                fconvId={fconvId}
                setFConfId={setFConfId}
                convId={convId}
                me={me as string}
                messagesEndRef={messagesEndRef}
              />
            </>
          )}
        </div>
      )}

      {currentUser == undefined && (
        <div className={Styles.newCnv}>
          <h1>Start a new conversation</h1>
        </div>
      )}
    </div>
  );
};
