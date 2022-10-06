import { useContext } from "react";
import { ChatContext, ChatContextType } from "@contexts/chatContext";
import Styles from "@styles/chat.module.css";
import Avatar from "@public/profile.jpg";
import Image from "next/image";
import TagCross from "@public/white-cross.svg";
import Classes from "@styles/modals.module.css"

// use datalist to show possible results
export function CustomToggleBtn(id: any) {
  const { setProtectedChannel, setChannelMode, channelMode } = useContext(
    ChatContext
  ) as ChatContextType;
  const Ids = ["Private", "Public", "Protected"];
  const setChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    let checked = event.target.checked;
    let index = event.target.id;

    // Unset the protected channel
    if (index === "Protected" && checked == false) {
      setProtectedChannel(false);
    }

    // Set the other channels
    if (index === "Protected" && checked == true) {
      setProtectedChannel(true);
      setChannelMode("Protected");
    } else if (index === "Public") {
      setChannelMode("Public");
    } else if (index === "Private") {
      setChannelMode("Private");
    }

    let newIds = Ids.filter((id) => id !== index);
    newIds.forEach((id) => {
      let el: HTMLInputElement = document.getElementById(
        id
      ) as HTMLInputElement;
      el.checked = false;
    });
  };

  return (
    <>
      <input
        type="checkbox"
        name={id.id}
        id={id.id}
        className={Styles.checkbox}
        checked={channelMode === id.id ? true : false}
        onChange={(event) => setChecked(event)}
      />
      <label htmlFor={id.id} className={Styles.label}></label>
    </>
  );
}

export function Option(props: { type: string }) {
  return (
    <>
      <div>
        <h3 className={Styles.chnlType}>{props.type}</h3>
        {/* toggle switch lies here */}
        <CustomToggleBtn id={props.type} />
      </div>
    </>
  );
}

export function SuggestedUsr(props: {
  user: any;
  action: any;
}): JSX.Element {
  return (
    <div className={Styles.sUsr}>
      <div>
        <div className={Classes.dropAvatar}>
          <img src={props.user?.avatar} />
        </div>
        <span>{props.user.fullname}</span>
      </div>
      <button
        onClick={() => props.action(props.user)}
        className={Styles.btnAdd}
      >
        {"Add"}
      </button>
    </div>
  );
}

export function UsrTag(props: {
  removeTag: any,
  id: number,
  fullname: string
}) {
  return (
    <div className={Styles.usrTag} id={props.id.toString()}>
      {props.fullname}
      <div
        onClick={(e) => props.removeTag(props.fullname, e, props.id)}
      >
        <Image src={TagCross} width={6} height={6} />
      </div>
    </div>
  );
}

export function addUsrToChannel(
  user: any,
  setAddedUsers: any,
  setshowDropdown: any,
  addedUsers: any[],
  inputRef: any,
  setOldUsers: any,
  oldUsers: any
) {
  inputRef.current.focus();
  setshowDropdown(false);

  let items_oldUsers: any = []; // users that we are gonna filter again
  let items_addedUsers: any = [...addedUsers]; // users that we are gonna send to db

  console.log(oldUsers);
  oldUsers?.map((item: any) => {
    if (item?.fullname != user?.fullname) items_oldUsers.push(item);
    else if (item?.fullname == user?.fullname) items_addedUsers.push(item);
  });
  
  setOldUsers(items_oldUsers);
  setAddedUsers(items_addedUsers);
}

export function removeUsrFromChannel() {
  // console.log("removed");
}

export function filterOutUsers(
  value: string,
  oldUsers: any,
  setshowDrpdown: any,
) {
  // search for the user to show a dropdown with the suggested users
  let upvalue = value.toUpperCase();
  // Return to initial state
  if (upvalue == "") {
    // setDropUsers([]);
    setshowDrpdown(false);
    return
  }

  console.log(oldUsers);

  // setDropUsers(
  //   oldUsers.filter((usr: any) => usr.fullname.toUpperCase().includes(upvalue))
  // );

  // Show the dropdown
  upvalue ? setshowDrpdown(true) : setshowDrpdown(false);
}

export function filterUsers(
  value: string,
  setCloseUsrs: any,
  setshowDrpdown: any,
  initialUsrState: any,
  setUsrTags: any
) {
  let upvalue = value.toUpperCase();

  console.log(upvalue);
  // Return to initial state
  if (upvalue == "") {
    setCloseUsrs([]);
    setshowDrpdown(false);
    return;
  }

  // Filter out results
  let newUsrs = initialUsrState.filter((usr: any) =>
    usr.fullname.toUpperCase().includes(upvalue)
  );

  setCloseUsrs(newUsrs);
  // Show the dropdown
  upvalue ? setshowDrpdown(true) : setshowDrpdown(false);
}

export function removeTag(
  e: any,
  element: any,
  id: string,
  addedUsers: any,
  setAddedUsers: any,
  oldUsers: any,
  setOldUsers: any
) {
  let res = addedUsers.filter((item: any) => item.fullname !== element)
  setAddedUsers(res);
  let returnItem = addedUsers.filter((item: any) => item.fullname == element);
  if (returnItem.length != 0) setOldUsers([...oldUsers, ...returnItem]);
}
