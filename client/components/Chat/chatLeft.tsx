import { ChatContext, ChatContextType } from "@contexts/chatContext";
import { postChannel } from "@hooks/useFetchData";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import Styles from "@styles/chat.module.css";
import { ModalBox } from "@components/Modal";
import { ChannelAsset, BlueChannelAsset } from "@svg/index";
import Image from "next/image";
import { filterChatUsers } from "@utils/chat";
import Link from "next/link";
import Search from "@public/Icon.svg";
import { getImageBySize } from "@hooks/Functions";
import socket_notif from "config/socketNotif";

export const ChatLeft = (props: { login: any }) => {
  // Setting some local state
  const {
    lastUsers,
    setShowCnv,
    showCnv,
    setLastUsers,
    chatUsersRefs,
    friends,
    convId,
    setConvId
  } = useContext(ChatContext) as ChatContextType;
  const [show, setShow] = useState<boolean>(false);
  const [displayBlueIcon, setDisplayBlueIcon] = useState(false);
  const [channelDetails, setChannelDetails] = useState<any>();
  const [previousElem, setPreviousElem] = useState<any>();

  const router = useRouter();
  const dotRefs: Array<HTMLDivElement> | any = useRef([]);

  useEffect(() => {
  }, [friends]);

  function resetForm(formik: any) {
    formik.setFieldValue("cName", "");
    formik.setFieldValue("password", "");
    formik.setFieldValue("member", "");
  }

  // functions
  async function createChannel(
    channelName: string,
    convType: string,
    password: string,
    members: Array<string>,
    setUsrTags: any,
    formik: any,
    setError: any
  ) {
    if (
      channelName.length == 0 ||
      convType.length == 0 ||
      members.length == 0
    ) {
      setError("Please enter the required credentials**");
    } else {
      setError("");
      setShow(!show);
      var loginList: string[] = [];

      members.forEach((member: any, i: any) => {
        friends.forEach((friend: any) => {
          if (friend.fullname == member) loginList.push(friend.login);
        });
      });

      const data = {
        name: channelName,
        type: convType,
        members: loginList,
        password: password,
      };
      postChannel(setChannelDetails, router, data);

      // reset the necessary fields
      resetForm(formik);
      setUsrTags([]);
    }
  }

  useEffect(() => {
    if (props.login != undefined) setShowCnv(true);
  }, []);

  useEffect(() => {
    // setLastUsers(props.login);
  }, [lastUsers]);

  function selectUser(element: any) {
    if (previousElem?.classList.value.includes("selected"))
      previousElem.classList.remove(Styles.selectedChatUsr);
    if (element.children[1].children[1]?.classList.value.includes("displayDot"))
      element.children[1].children[1].classList.remove(Styles.displayDot);
    element.classList.add(Styles.selectedChatUsr);
    setPreviousElem(element);
  }

  // listen on msgs
  socket_notif.on("newMsg", (response) => {
    setConvId(response?.convId);

    lastUsers.forEach((user, i) => {
      if (user.login == response.sender) {
        dotRefs.current[i].classList.add(Styles.displayDot);
      }
    });
    
  });

  useEffect(() => {
  }, [convId])

  return (
    <>
      <div className={`${Styles.chatLeft} ${showCnv ? Styles.hideUsers : ""}`}>
        <div className={Styles.leftContent}>
          <div className={Styles.topSection}>
            <div className={Styles.msg}>Message</div>
            {!displayBlueIcon && (
              <div
                onClick={() => setShow(!show)}
                className={Styles.channel}
                onMouseOver={() => setDisplayBlueIcon(true)}
              >
                <ChannelAsset color="#758293" />
              </div>
            )}
            {displayBlueIcon && (
              <div
                onMouseLeave={() => setDisplayBlueIcon(false)}
                className={Styles.channel}
                onClick={() => setShow(!show)}
              >
                <BlueChannelAsset />
              </div>
            )}
            <ModalBox
              show={show}
              setShow={setShow}
              createChannel={createChannel}
            />
          </div>
          <div className={Styles.chatSearch}>
            <Image src={Search} width={20} height={20} />
            <input
              type="Text"
              className={Styles.chatInput}
              placeholder="Search"
              onChange={(e) =>
                filterChatUsers(e, lastUsers, setLastUsers, initialusrData)
              }
            />
          </div>
          <div className={Styles.bottomSection}>
            {lastUsers.map((user: any, i: any) => (
              <Link href={"/chat?login=" + user.login} key={i}>
                <div
                  key={i}
                  ref={(element) => {
                    chatUsersRefs.current[parseInt(i)] = element;
                  }}
                  onClick={() => selectUser(chatUsersRefs.current[parseInt(i)])}
                  className={Styles.chatUser}
                >
                  <div className={Styles.avatarName}>
                    <div className={Styles.avatar}>
                      <img
                        src={
                          user?.avatar?.startsWith("https")
                            ? user?.avatar
                            : getImageBySize(user?.avatar, 70)
                        }
                      />
                    </div>
                    <div className={Styles.username}>
                      {user?.name} {user?.channelname}
                    </div>
                  </div>
                  <div className={Styles.statusDiv}>
                    <p className={Styles.status}>
                      {user?.membersNum
                        ? user?.membersNum + " members"
                        : user.status}
                    </p>
                    <div
                      className={Styles.redDot}
                      ref={(element) => {
                        dotRefs.current[parseInt(i)] = element;
                      }}
                    >
                      &nbsp;
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {lastUsers.length == 0 && (
              <div className={Styles.newCnv}>No conversations yet</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
