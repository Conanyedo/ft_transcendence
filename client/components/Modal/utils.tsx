import { useContext } from "react";
import { ChatContext, ChatContextType } from "@contexts/chatContext";
import { chatUser } from "@Types/dataTypes";
import Styles from "@styles/chat.module.css"
import Avatar from "@public/profile.jpg";
import Image from "next/image";

// use datalist to show possible results 
export function CustomToggleBtn(id: any) {

    const { setProtectedChannel, setChannelMode, channelMode } = useContext(ChatContext) as ChatContextType;
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
            let el: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
            el.checked = false;
        })
    }

    return (
        <>
            <input type="checkbox" name={id.id} id={id.id} className={Styles.checkbox} checked={(channelMode === id.id) ? true : false} onChange={(event) => setChecked(event)} />
            <label htmlFor={id.id} className={Styles.label}></label>
        </>)
}

export function Option(props: { type: string }) {

    return (<>
        <div>
            <h3>{props.type}</h3>
            {/* toggle switch lies here */}
            <CustomToggleBtn id={props.type} />
        </div>
    </>)
}

export function SuggestedUsr(props: { user: chatUser, userStatus: boolean, addUsrToChannel: any, removeUsrFromChannel: any }): JSX.Element {
    return (<div className={Styles.sUsr}>
        <div>
            <div><Image src={Avatar} width={32} height={32} /></div>
            <span>{props.user.firstName + " " + props.user.lastName}</span>
        </div>
        <button onClick={props.userStatus ? () => props.addUsrToChannel(props.user) : () => props.removeUsrFromChannel()} className={props.userStatus ? Styles.btnAdd : Styles.btnRmv}>{props.userStatus ? "Add" : "Remove"}</button>
    </div>)
}

export function UsrTag(props: { fullname: string, removeTag: any, id: number }) {
    return (
        <div className={Styles.usrTag} id={props.id.toString()}>
            {props.fullname}
            <div onClick={(e) => props.removeTag(props.fullname, e)}><Image src={TagCross} width={6} height={6} /></div>
        </div>
    )
}

export function addUsrToChannel( user: chatUser, setUsrTags: any, setshowDrpdown: any, usrTags: any) {
    let fullname = user.firstName + " " + user.lastName;
    setUsrTags([...usrTags, fullname]);
    setshowDrpdown(false);
}

export function removeUsrFromChannel() {
    console.log("removed");
}

export function filterUsers(value: string, setCloseUsrs:any, setshowDrpdown: any, initialUsrState: any ) {

    let upvalue = value.toUpperCase();

    // Return to initial state 
    if (upvalue == "") {
        setCloseUsrs(initialUsrState);
        setshowDrpdown(false);
        return;
    }

    // Filter out results
    let newUsrs = initialUsrState.filter((usr: any) => usr.firstName.toUpperCase().startsWith(upvalue) || usr.lastName.toUpperCase().startsWith(upvalue))

    setCloseUsrs(newUsrs);
    // Show the dropdown
    upvalue ? setshowDrpdown(true) : setshowDrpdown(false);
}

export function removeTag(fullname: string, e: React.ChangeEvent<HTMLInputElement>, id: string, usrTags: Array<string>, setUsrTags: any) {
    let i = e.target.parentElement?.parentElement?.parentElement?.id;
    const newUsrTags = usrTags.filter((item) => item !== fullname);
    setUsrTags(newUsrTags);
}