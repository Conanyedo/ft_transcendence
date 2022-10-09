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

export const ChatLeft = (props: {
  login: any;
  selectedConv: any;
  setSelectedConv: any;
}) => {
  // Setting some local state
  const {
    lastUsers,
    setShowCnv,
    showCnv,
    setLastUsers,
    chatUsersRefs,
    friends,
    convId,
    setConvId,
  } = useContext(ChatContext) as ChatContextType;
  const [show, setShow] = useState<boolean>(false);
  const [displayBlueIcon, setDisplayBlueIcon] = useState(false);
  const [channelDetails, setChannelDetails] = useState<any>();
  const [searchVal, setSearchVal] = useState("");

  const router = useRouter();
  const dotRefs: Array<HTMLDivElement> | any = useRef([]);

  // set a state just for filtered users and put the actual users in it

  const [searchUsrs, setSearchUsrs] = useState(lastUsers);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);

    return () => setMount(false);
  }, [])

  useEffect(() => {}, [friends]);

  function resetForm(formik: any) {
    formik.setFieldValue("cName", "");
    formik.setFieldValue("password", "");
    formik.setFieldValue("member", "");
  }

  function validateData(data: any) {
    const checkname = (obj: any) => obj.name == data.channelName;
    if (
      data.channelName.length == 0 ||
      data.convType.length == 0
    ) {
      return "There is a missing input.";
    }
    if (lastUsers.some(checkname)) {
      return "Name already in use.";
    }
    if (!(data.channelName.length >= 4) || !RegExp(
      /^(?=.{2,20}$)(?![ _.-])(?!.*[_.-]{2})[a-zA-Z0-9 ._-]+(?<![ _.-])$/
    ).test(data.channelName)) {
      return "Channel name shouldbe between 3 to 20 characters and can contain one of these: [space_.-].";
    }
    if (data.convType == "Protected" && !RegExp(
      /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/
    ).test(data.password)) {
      return "Password must contain at least 8 characters.At least one number, one uppercase letter and one special character";
    }
    return "";
  }

  // functions
  async function createChannel(
    channelName: string,
    convType: string,
    password: string,
    members: Array<string>,
    setAddedUsers: any,
    formik: any,
    error: string,
    setError: any
  ) {
    let res = validateData(
      { channelName, convType, members, password },
    );
    if (res == ""
    ) {
      var loginList: string[] = [];
      loginList = members?.map((member: any) => member?.login);
      let data: any = { name: channelName, type: convType, members: loginList };
      if (password != "") data.password = password;
      postChannel(setChannelDetails, router, data, setError);
      // reset the necessary fields
      setShow(!show);
      setError("");
    } else {
        setError(res);
    }
    resetForm(formik);
    setAddedUsers([]);
  }

  useEffect(() => {
    if (searchVal == "") setSearchUsrs(lastUsers);
  }, [lastUsers, searchVal]);

  // listen on msgs
  useEffect(() => {
    socket_notif.on("newMsg", (response) => {
      setConvId(response?.data.convId);

      lastUsers.forEach((user, i) => {
        if (user.login == response.data.sender) {
          dotRefs.current[i].classList.add(Styles.displayDot);
        }
      });
    });
    return () => {
      socket_notif.off("newMsg");
    };
  }, []);

  function selectConv(convId: string) {
    setShowCnv(true);
    props.setSelectedConv(convId);
  }

  useEffect(() => {}, [convId]);

  return (
    <>
      {mount && <div
        className={`${Styles.chatLeft} ${showCnv ? Styles.displayNone : ""}`}
      >
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
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>
          <div className={Styles.bottomSection}>
            {searchUsrs?.map((user: any, i: any) => {
              if (
                user?.name?.toUpperCase().includes(searchVal.toUpperCase()) ||
                user?.channelname
                  ?.toUpperCase()
                  .includes(searchVal.toUpperCase()) ||
                searchVal === ""
              ) {
                return (
                  <Link
                    href={
                      `/chat?${user.type == "Dm" ? "login" : "channel"}=` +
                      user.login
                    }
                    key={i}
                  >
                    <div
                      key={i}
                      ref={(element) => {
                        chatUsersRefs.current[parseInt(i)] = element;
                      }}
                      onClick={() => selectConv(user.convId)}
                      className={`${Styles.chatUser} ${
                        props.selectedConv == user.convId
                          ? Styles.selectedChatUsr
                          : ""
                      }`}
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
                );
              }
            })}
            {lastUsers?.length == 0 && (
              <div className={Styles.newCnv}>No conversations yet</div>
            )}
          </div>
        </div>
      </div>}
    </>
  );
};
