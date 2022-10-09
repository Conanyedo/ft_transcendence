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
  UnmuteMemberFromChnl,
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

// functions to set the user statuses

async function banMember(user: any, convId: string, setData: any) {
  let data = { convId: convId, member: user.login };

  if (await banMemberFromChannel(data)) {
    getDataOfMembers(convId, setData);
  }
}

async function upgradeMember(user: any, convId: string, setData: any) {
  const data = { convId: convId, member: user.login, status: "Admin" };
  if (await changeMemberRole(data, () => null)) {
    getDataOfMembers(convId, setData);
  }
}

async function downgradeMember(user: any, convId: string, setData: any) {
  const data = { convId: convId, member: user.login, status: "Member" };
  if (await changeMemberRole(data, () => null)) {
    getDataOfMembers(convId, setData);
  }
}

async function UnmuteMember(convId: string, user: any, setData: any) {

  let data = { convId: convId, member: user.login };
  if (await UnmuteMemberFromChnl(data)) {
    getDataOfMembers(convId, setData);
  }
}

const DropDown: React.FC<{
  setRefs: any;
  i: number;
  content: Array<string>;
  functions: any;
  setshowdrop: any;
}> = ({ setRefs, i, content, functions, setshowdrop }) => {

  return (
    <>
      <div className={Styles.menuDropdown} id={i.toString()}>
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
    </>
  );
};

function setMemberActions(data: any, methods: any) {
  methods.setContent(["Upgrade Member", "Ban Member", "Mute Member"]);
  methods.setFunctions([
    () => upgradeMember(data.user, data.convId, methods.setData),
    () => banMember(data.user, data.convId, methods.setData),
    () => methods.setmuteShow(true),
  ]);
}

function setAdminActions(data: any, methods: any) {
  methods.setContent(["Downgrade Member", "Ban Member", "Mute Member"]);

  // update muteMember to a handler to show popup
  methods.setFunctions([
    () => downgradeMember(data.user, data.convId, methods.setData),
    () => banMember(data.user, data.convId, methods.setData),
    () => methods.setmuteShow(true),
  ]);
}

function setMutedActions(data: any, methods: any) {
  methods.setContent([, "Unmute Member"]);
  methods.setFunctions([
    () => null,
    () => UnmuteMember(data.convId, data.user, methods.setData),
  ]);
}

const showElemDropdown = (e: any, data: any, propMethods: any) => {
  const methods = {
    setContent: propMethods.setContent,
    setFunctions: propMethods.setFunctions,
    setmuteShow: propMethods.setmuteShow,
    setData: propMethods.setData,
  };

  propMethods.setSelectedUsr(data.user);

  // resetting at first

  const id = e.target.parentElement.parentElement.parentElement.id;
  // setdropdwn(true);
  // Condition if the clicked user is me
  if (data.role == "Owner") {
    if (data.user.status == "Admin") setAdminActions(data, methods);
    else if (data.user.status == "Member") setMemberActions(data, methods);
    else if ((data.user.status = "Muted")) setMutedActions(data, methods);
  } else if (data.role == "Admin") {
    if (data.user.status == "Admin") setAdminActions(data, methods);
    else if (data.user.status == "Member") setMemberActions(data, methods);
    else if (data.user.status == "Muted") setMutedActions(data, methods);
  }
};

const MemberMenu = (props: {
  data: any;
  setRefs: any;
  setContent: any;
  setFunctions: any;
  setSelectedUsr: any;
  setmuteShow: any;
  setData: any;
  i: number;
  permit: any;
}) => {
  // data = { user, role, i, convId, login}

  const methods = {
    setRefs: props.setRefs,
    setContent: props.setContent,
    setFunctions: props.setFunctions,
    setSelectedUsr: props.setSelectedUsr,
    setmuteShow: props.setmuteShow,
    setData: props.setData,
  };

  const [showdropmenu, setshowdropmenu] = useState<boolean>(false);

  const ClickHandler = (e: any) => {
    showElemDropdown(e, props.data, methods);
    setshowdropmenu(!showdropmenu);
  };
  const dropRef = useRef<any>("");

  useOutsideAlerter(dropRef, setshowdropmenu);

  return (
    <>
      <div
        id={props.i.toString()}
        onClick={ClickHandler}
        style={{
          display: props.permit ? "block" : "none",
          cursor: "pointer",
        }}
        ref={dropRef}
      >
        <div>
          <Image src={menu} width={6} height={30} />
        </div>
        <div id={props.i.toString()}>
          {showdropmenu && (
            <DropDown
              setRefs={props.setRefs}
              i={props.i}
              content={props.data.content}
              functions={props.data.functions}
              setshowdrop={setshowdropmenu}
            />
          )}
        </div>
      </div>
    </>
  );
};

const Members = (props: {
  role: string;
  users: Array<Object>;
  category: string;
  convId: string;
  login: string;
  setData: any;
}) => {
  const [dropdwn, setDropdown] = useState(false);
  const setRefs: any = useRef([]);
  const [permit, setPermit] = useState(false);
  const [content, setContent] = useState<string[]>([]);
  const [functions, setFunctions] = useState<any>([]);
  const [previousDrop, setPreviousDrop] = useState();
  const [muteShow, setmuteShow] = useState(false);
  const [selectedUsr, setSelectedUsr] = useState();

  const me = localStorage.getItem("owner");

  useEffect(() => {
    setPermit(setRights(props.role, props.category));
  }, [props.role, props.category]);

  useEffect(() => {}, [props.users]);

  useEffect(() => {
  }, [functions, content]);

  const router = useRouter();

  const reloadHandler = () => {
    getDataOfMembers(props.convId, props.setData);
    setmuteShow(false);
  };
  // useOutsideAlerter(props.menuRef, props.setDropdown);
  return (
    <>
      {muteShow && (
        <MuteModal
          setShow={reloadHandler}
          user={selectedUsr}
          convId={props.convId}
        />
      )}
      {props?.users?.length !== 0 && (
        <div className={Styles.members}>
          {props.category}
          {props?.users?.map((user: any, i: number) => (
            <div key={i}>
              <div className={Styles.membersAvtr} onClick={() => router.push(`/profile/${user.login}`)}>
                <img
                  src={getImageBySize(user?.avatar, 70)
                  }
                />
                <span>{user.fullname}</span>
              </div>
              {me != user.login && props.role != "Member" && (
                <MemberMenu
                  data={{
                    user: user,
                    role: props.role,
                    i,
                    convId: props.convId,
                    functions: functions,
                    content: content,
                  }}
                  setRefs={setRefs}
                  setContent={setContent}
                  setFunctions={setFunctions}
                  setSelectedUsr={setSelectedUsr}
                  setmuteShow={setmuteShow}
                  setData={props.setData}
                  i={i}
                  permit={permit}
                />
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
      result = arr?.filter(callback);
      if (result.length !== 0) {
        setRole(result[0]?.status);
        return;
      }
    }
  });
}

export const getDataOfMembers = async (convId: any, setData: any) => {
  const value: any = await getChannelProfile(convId, setData);
  setData(value?.data?.data);
  return;
};

export const Profile = (props: {
  login: any;
  setShowSetModal: any;
  convId: string;
  status: string;
  setData: any;
  data: any;
  relation: string;
}) => {
  const [role, setRole] = useState("");

  useEffect(() => {
    getDataOfMembers(props.convId, props.setData);
  }, []);

  useEffect(() => {
    checkRole(props.data, setRole);
  }, [props.data, role]);

  return (
    <>
      <Header
        setShowSetModal={props.setShowSetModal}
        status={props.status}
        role={role}
      />
      {props.data?.length !== 0 && (
        <>
          <Members
            role={props.relation}
            users={props.data?.owner}
            key="Owner"
            category="Owner"
            convId={props.convId}
            login={props.login}
            setData={props.setData}
          />
          <Members
            role={props.relation}
            users={props.data?.admins}
            key="Admins"
            category="Admin"
            convId={props.convId}
            login={props.login}
            setData={props.setData}
          />
          <Members
            role={props.relation}
            users={props.data?.members}
            key="Members"
            category="Member"
            convId={props.convId}
            login={props.login}
            setData={props.setData}
          />
          <Members
            role={props.relation}
            users={props.data?.muted}
            key="Muted"
            category="Muted"
            convId={props.convId}
            login={props.login}
            setData={props.setData}
          />
        </>
      )}
    </>
  );
};
