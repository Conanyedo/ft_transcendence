import { useEffect, useRef, useState } from "react";
import Styles from "@styles/chat.module.css";
import { MenuDropdown } from "./MenuDropdown";
import Image from "next/image";
import addUser from "@public/add-user.svg";
import {
  banMemberFromChannel,
  changeMemberRole,
  getChannelProfile,
  leaveChannel,
  muteMemberFromChnl,
} from "@hooks/useFetchData";
import menu from "@public/menu-asset.svg";
import { getImageBySize } from "@hooks/Functions";
import { useOutsideAlerter } from "@hooks/Functions";
import { AnyMessageParams } from "yup/lib/types";
import { useRouter } from "next/router";
import { MuteModal } from "@components/MuteModal";

const Header = (props: {
  setShowSetModal: any;
  status: string;
  role: string;
}) => {
  const statuses = ["Banned", "Muted", "Left"];

  return (
    <div className={Styles.profileHeader}>
      <h1>Channel Profile</h1>
      {["Owner", "Admin"].includes(props.role) && (
        <>
          {!statuses.includes(props.status) && (
            <button onClick={() => props.setShowSetModal(true)}>
              <Image src={addUser} width={18} height={18} />
              Add Members
            </button>
          )}
        </>
      )}
    </div>
  );
};

const setRights = (role: string, category: string) => {
  let categories = ["Member", "Admin", "Owner"];
  return categories.indexOf(role) >= categories.indexOf(category);
};

const MenuElement = (props: {
  role: any;
  category: any;
  content: any;
  functions: any;
  dropdwn: any;
  setDropdown: any;
  menuRef: any;
}) => {
  useEffect(() => {
    console.log(props.content, props.functions);
  }, [props.content, props.functions]);

  return (
    <MenuDropdown
      content={props.content}
      functions={props.functions}
      id={props.category}
      dropdwn={props.dropdwn}
      setDropdown={props.setDropdown}
      menuRef={props.menuRef}
    />
  );
};

// functions to set the user statuses

async function banMember(user: any, convId: string, login: any, router: any) {
  let data = { convId: convId, member: user.login };

  if (await banMemberFromChannel(data)) router.reload();
  else console.log("There seems to be something wrong!");
}

async function upgradeMember(
  user: any,
  convId: string,
  login: any,
  router: any
) {
  const data = { convId: convId, member: user.login, status: "Admin" };
  if (await changeMemberRole(data, () => null)) router.reload();
  else console.error("There seems to be something wrong!");
}

async function downgradeMember(
  user: any,
  convId: string,
  login: AnyMessageParams,
  router: any
) {
  const data = { convId: convId, member: user.login, status: "Member" };
  if (await changeMemberRole(data, () => null)) {
    console.log("changed successfully");
  } else {
    console.error("There seems to be something wrong!");
  }
}

// POST /chat/muteMember
async function muteMember(user: any, convId: string, login: any, router: any) {
  // muteMemberFromChnl
  if (
    await muteMemberFromChnl({
      convId: convId,
      member: user.login,
      seconds: 30,
    })
  )
    router.reload();
  else console.log("There seems to be something wrong!");
  // console.log(user, convId);
}

const showElemDropdown = (
  e: any,
  user: any,
  dropdwn: any,
  setdropdwn: any,
  setRefs: any,
  role: any,
  setContent: any,
  setFunctions: any,
  convId: any,
  login: any,
  router: any,
  previousId: any,
  setPreviousId: any
) => {
  console.log(setRefs);

  // resetting at first
  console.log(previousId, dropdwn);
  if (previousId !== undefined) {
    setdropdwn(false);
    console.log(previousId);
    previousId.style = "display: none !important";
  }

  const id = e.target.parentElement.parentElement.parentElement.id;
  console.log(id);
  // setdropdwn(true);
  // Condition if the clicked user is me
  if (role == "Owner") {
    console.log(setRefs.current[id].style);
    setdropdwn(true);
    setRefs.current[id].style = "display: block !important";

    // setdropdwn(true);
    // setdropdwn(!dropdwn);
    if (user.status == "Admin") {
      setContent(["Downgrade Member", "Ban Member", "Mute Member"]);
      setFunctions([
        () => downgradeMember(user, convId, login, router),
        () => banMember(user, convId, login, router),
        () => muteMember(user, convId, login, router),
      ]);
    } else if (user.status == "Member") {
      setContent(["Upgrade Member", "Ban Member", "Mute Member"]);
      setFunctions([
        () => upgradeMember(user, convId, login, router),
        () => banMember(user, convId, login, router),
        () => muteMember(user, convId, login, router),
      ]);
    }
    setPreviousId(setRefs.current[id]);
  } else if (role == "Admin") {
    console.log(setRefs.current[id]);
    setdropdwn(true);
    // console.log(id);
    setRefs.current[id].style = "display: block !important";
    if (user.status == "Admin") {
      setContent(["Downgrade Member", "Ban Member", "Mute Member"]);
      setFunctions([
        () => downgradeMember(user, convId, login, router),
        () => banMember(user, convId, login, router),
        () => muteMember(user, convId, login, router),
      ]);
    } else if (user.status == "Member") {
      setContent(["Upgrade Member", "Ban Member", "Mute Member"]);
      setFunctions([
        () => upgradeMember(user, convId, login, router),
        () => banMember(user, convId, login, router),
        () => muteMember(user, convId, login, router),
      ]);
    }
    setPreviousId(setRefs.current[id]);
  }
};

const Members = (props: {
  role: string;
  users: Array<Object>;
  category: string;
  convId: string;
  login: string;
}) => {
  const [dropdwn, setDropdown] = useState(false);
  const setRefs: any = useRef([]);
  const [permit, setPermit] = useState(false);
  const [content, setContent] = useState<string[]>([]);
  const [functions, setFunctions] = useState<any>([]);
  const [previousDrop, setPreviousDrop] = useState();
  const [muteShow, setmuteShow] = useState(false);

  const me = localStorage.getItem("owner");

  useEffect(() => {
    setPermit(setRights(props.role, props.category));
  }, [props.role, props.category]);

  useEffect(() => {}, [props.users]);

  useEffect(() => {
    console.log("functions are", functions);
    console.log("content is", content);
  }, [functions, content]);

  const router = useRouter();
  // useOutsideAlerter(props.menuRef, props.setDropdown);
  return (
    <>
    <MuteModal show={muteShow} setShow={setmuteShow}/>
      {props?.users?.length !== 0 && (
        <div className={Styles.members}>
          {props.category}
          {props?.users?.map((user: any, i: number) => (
            <div key={i}>
              <div className={Styles.membersAvtr}>
                <Image
                  src={
                    user?.avatar?.startsWith("https")
                      ? user?.avatar
                      : getImageBySize(user?.avatar, 70)
                  }
                  width={40}
                  height={40}
                />
                <span>{user.fullname}</span>
              </div>
              {me != user.login && (
                <div
                  id={i.toString()}
                  onClick={(e: any) =>
                    showElemDropdown(
                      e,
                      user,
                      dropdwn,
                      setDropdown,
                      setRefs,
                      props.role,
                      setContent,
                      setFunctions,
                      props.convId,
                      props.login,
                      router,
                      previousDrop,
                      setPreviousDrop
                    )
                  }
                  style={{
                    display: permit ? "block" : "none",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <Image src={menu} width={6} height={30} />
                  </div>
                  <div
                    id={i.toString()}
                    // ref={(element) => (setRefs.current[i] = element)}
                  >
                      <div
                        className={Styles.menuDropdown}
                        id={i.toString()}
                        ref={(element: any) => (setRefs.current[i] = element)}
                        style={{ display: "none" }}
                      >
                        {content.map((element, i) => (
                          <div
                            key={i}
                            onClick={functions[i]}
                            className={[1, 2].includes(i) ? Styles.redText : ""}
                          >
                            {element}
                          </div>
                        ))}
                      </div>
                    {/* <MenuElement
                      role={props.role}
                      category={props.category}
                      content={content}
                      functions={functions}
                      dropdwn={dropdwn}
                      setDropdown={setDropdown} */}
                    {/* /> */}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

function ObjToArray(data: any) {
  var outputData = [];
  for (var i in data) {
    outputData.push(data[i]);
  }
  return outputData;
}

function checkRole(data: any, setRole: any) {
  let myLogin: any = localStorage.getItem("owner");
  let callback = (item: any) => {
    return item.login == myLogin;
  };

  let dataArr = ObjToArray(data);

  dataArr.forEach((arr) => {
    let result: any;
    if (arr.length !== 0) {
      result = arr.filter(callback);
      if (result.length !== 0) {
        setRole(result[0]?.status);
        return;
      }
    }
  });
}

export const Profile = (props: {
  login: any;
  setShowSetModal: any;
  convId: string;
  status: string;
}) => {
  const [data, setData] = useState<any>([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    const getData = async () => {
      const value: any = await getChannelProfile(props.convId, setData);
      setData(value?.data);
      return;
    };
    getData();
  }, []);

  useEffect(() => {
    checkRole(data, setRole);
  }, [data, role]);

  return (
    <>
      <Header
        setShowSetModal={props.setShowSetModal}
        status={props.status}
        role={role}
      />
      {data?.length !== 0 && (
        <>
          <Members
            role={role}
            users={data?.owner}
            key="Owner"
            category="Owner"
            convId={props.convId}
            login={props.login}
          />
          <Members
            role={role}
            users={data?.admins}
            key="Admins"
            category="Admin"
            convId={props.convId}
            login={props.login}
          />
          <Members
            role={role}
            users={data?.members}
            key="Members"
            category="Member"
            convId={props.convId}
            login={props.login}
          />
          <Members
            role={role}
            users={data?.muted}
            key="Muted"
            category="Muted"
            convId={props.convId}
            login={props.login}
          />
        </>
      )}
    </>
  );
};

// else if (user.status == "Admin") {
//   console.log("admin here");

// }

//
// if (!dropdwn) {
//   setRefs.current[id].style = "display: block";
//   const category = setRefs.current[id].firstChild.id;
//   changeContent(
//     props.role,
//     category,
//     setContent,
//     setFunctions,
//     setPermit,
//     user,
//     props.convId
//   );
//   setdropdwn(true);
// } else {
//   setRefs.current[id].style = "display: none";
//   setdropdwn(false);
// }

// const changeContent = (
//   role: any,
//   category: any,
//   setContent: any,
//   setFunctions: any,
//   setPermit: any,
//   user: any,
//   convId: string
// ) => {
//   const me = localStorage.getItem("owner");
//   if (role == category && me == user?.login) {
//     setContent([, "leave Channel"]);
//     setFunctions([() => space(), () => banMember(user, convId)]);
//   } else if (role == category && me != user?.login) {
//     setContent([, "Remove Member"]);
//     setFunctions([space(), banMember(user, convId)]);
//   } else if (
//     role != category &&
//     setRights(role, user.role) &&
//     role !== "Member"
//   ) {
//     setContent(["Upgrade Role", "Remove Member"]);
//     setFunctions([
//       () => upgradeMember(user, convId),
//       () => banMember(user, convId),
//     ]);
//   }
// };
