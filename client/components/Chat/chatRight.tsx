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
import Router, { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import arrowBack from "@public/arrow-back.svg";
import { ChatContext, ChatContextType } from "@contexts/chatContext";
import Image from "next/image";
import { BackArrow } from "@svg/index";
import { MenuAsset } from "@svg/index";
import { MenuDropdown } from "./MenuDropdown";
import { GameIconAsset } from "@svg/index";
import sendArrow from "@public/send-arrow.svg";
import { getDataOfMembers, Profile } from "./Profile";
import { getImageBySize } from "@hooks/Functions";
import SettingGame from "@components/game/settingGame";
import { InviteMsg } from "./inviteMsg";
import socket_game from "config/socketGameConfig";
import { useDispatch } from "react-redux";
import { ShowErrorGameMsg } from "@store/UI-Slice";

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
  const dispatch = useDispatch();

  const me = localStorage.getItem("owner");

  const HideSetting = () => {
    ShowSettingGames(false);
  };
  function sendGame(gameID: string) {
    let data = {
      sender: me,
      invitation: gameID,
      convId: currentUser.convId,
      receiver: currentUser.login,
    };
    socket_notif.emit("sendMsg", data, (response: any) => {
      // handle msg
      if (!currentUser.convId) {
        Router.push("/chat");
        setTimeout(() => {
          Router.push("/chat?login=" + currentUser.login);
        }, 90);
      }
    });
    ShowSettingGames(false);
  }
  const showSettingGame = () => {
    socket_game.emit(
      "checkLobby",
      { admin: me, login: currentUser.login },
      (data: boolean) => {
        if (!data) {
          ShowSettingGames(true);
        } else {
          dispatch(ShowErrorGameMsg());
        }
      }
    );
  };

  return (
    <>
      {settingGames && (
        <SettingGame
          sendGame={sendGame}
          login={currentUser?.login}
          Hide={HideSetting}
        />
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
              onKeyDown={(event) => {
                if (event.keyCode !== 13) return;
                setMsg(
                  event.keyCode,
                  enteredMsg,
                  currentUser,
                  setStopUsr,
                  setEnteredMsg
                );
              }}
            />
            {(currentUser?.type == "Dm" || relation == "friend") && (
              <div onClick={showSettingGame} className={Styles.console}>
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
            onClick={(e) => {
              setMsg(13, enteredMsg, currentUser, setStopUsr, setEnteredMsg);
            }}
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
  setFConfId: any;
  convId: string;
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
  const [isMounted, setisMounted] = useState(false);
  useEffect(() => {
    setFConfId(convId);
  }, [convId]);

  useEffect(() => {
    setisMounted(true);
  }, []);
  return (
    <>
      {isMounted && currentUser && !profile && (
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
                {(chatMsg.convId == convId || fconvId == chatMsg.convId) && (
                  <div
                    className={Styles.msgBox}
                    style={{
                      justifyContent:
                        chatMsg.sender == me ? "flex-end" : "flex-start",
                    }}
                    ref={messagesEndRef}
                  >
                    {(!chatMsg.invitation && (
                      <>
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
                          {currentUser?.type !== "Dm" &&
                            chatMsg?.sender !== me && (
                              <span className={Styles.senderName}>
                                {chatMsg?.fullname}
                              </span>
                            )}
                          {chatMsg.msg}
                        </div>
                      </>
                    )) || <InviteMsg chatMsg={chatMsg} />}
                  </div>
                )}
                {(convId == chatMsg.convId || fconvId == chatMsg.convId) && (
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

  const data = { currentUser, relation, dropdwn: showMenuDropdown };
  const methods = {
    setDropdwn: setShowMenuDropdown,
    setRelation: setRelation,
    setModal: setShowSetModal,
  };

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

  useEffect(() => {}, [currentUser]);

  const showHideDrop = () => {
    setShowMenuDropdown(!showMenuDropdown);
  };

  return (
    <div className={Styles.topDetails}>
      <div className={Styles.flex}>
        {!profile && (
          <div className={Styles.arrowAsset}>
            <Image src={arrowBack} width={16} height={16} onClick={unshowCnv} />
          </div>
        )}

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
            <img src={getImageBySize(currentUser?.avatar, 70)} />
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
      {!["Left", "Banned"].includes(relation) && (
        <div className={Styles.menu} onClick={showUsrMenu}>
          <div onClick={showHideDrop} className={Styles.AssetCtn}>
            <MenuAsset />
          </div>
          {showMenuDropdown && <MenuDropdown data={data} methods={methods} />}
        </div>
      )}
    </div>
  );
};

export const ChatRight = (props: {
  setShowSetModal: any;
  setSelectedConv: any;
  login: number;
}) => {
  const {
    showCnv,
    setShowCnv,
    messagesEndRef,
    chatMsgs,
    setChatMsgs,
    setLastUsers,
    lastUsers,
    setInitialUsrData,
    convId,
    setConvId,
  } = useContext(ChatContext) as ChatContextType;

  // Setting some local state
  const [profile, setShowprofile] = useState(false);
  const [me, setMe] = useState(localStorage.getItem("owner"));

  // Settings and members modal show state
  const [showSetModal, setShowSetModal] = useState(false);
  const [membersMdl, showMembersMdl] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>();
  const [stopUsr, setStopUsr] = useState("");
  const [data, setData] = useState<any>([]);
  const [mount, setMount] = useState(false);

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
      setFConfId(response?.data.convId);
      setConvStatus(currentUser, setStopUsr);

      if (currentUser.convId == response.data.convId)
        setChatMsgs([...chatMsgs, response.data] as any);
      // reset the conversations
      getLastConvs(setLastUsers, () => null);
      scrollToBottom(messagesEndRef);
    });

    props.setSelectedConv(currentUser?.convId);

    return () => {
      socket_notif.off("newMsg");
    };
  }, [chatMsgs, currentUser]);

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
    if (currentUser?.convId == undefined && currentUser?.relation == "friend")
      setShowCnv(true);
    setConvStatus(currentUser, setStopUsr);
    setConvId(currentUser?.convId);
    setRelation(currentUser?.relation);
  }, [currentUser]);

  const refresh = async () => {
    showMembersMdl(false);
    await getDataOfMembers(currentUser.convId, setData);
  };

  useEffect(() => {
    setMount(true);

    return () => setMount(false);
  }, []);

  return (
    <>
      {mount && (
        <div
          className={`${Styles.chatRight} ${
            showCnv ? Styles.displayChat : Styles.displayNone
          }`}
        >
          <MembersModal
            showSetModal={membersMdl}
            refresh={refresh}
            currentUser={currentUser}
            setShowSetModal={showMembersMdl}
          />
          <SettingsModal
            showSetModal={showSetModal}
            setShowSetModal={setShowSetModal}
            data={currentUser}
          />
          {currentUser != undefined && (
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
                      setData={setData}
                      data={data}
                      relation={currentUser.relation}
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
            <div
              className={`${Styles.newCnv} ${
                showCnv ? Styles.displayChat : Styles.displayNone
              }`}
            >
              <h1>Start a new conversation</h1>
            </div>
          )}
        </div>
      )}
    </>
  );
};
