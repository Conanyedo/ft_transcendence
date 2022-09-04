import Styles from "@styles/chat.module.css"
import Cross from "@public/Cross.svg"
import TagCross from "@public/white-cross.svg"
import Image from "next/image"
import React, { Dispatch, SetStateAction, useContext, useState } from "react"
import _ from 'lodash'
import { ChatContext, ChatProvider, ChatContextType } from "@contexts/chatContext"
import { motion } from "framer-motion";
import Avatar from "@public/profile.jpg";
import { chatUser } from "@Types/dataTypes"

// use datalist to show possible results 
function CustomToggleBtn(id: any) {

    const { setProtectedChannel, setChannelMode, channelMode } = useContext(ChatContext) as ChatContextType;
    const Ids = ["Private", "Public", "Protected"];
    const setChecked = (event: React.ChangeEvent<HTMLInputElement>) => {

        let checked = event.target.checked;
        let index = event.target.id;

        // Unset the protected channel
        if (index === "Protected" && checked == false) {
            setProtectedChannel(false)
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
            <input type="checkbox" name={id.id} id={id.id} className={Styles.checkbox} checked={(channelMode === id.id) ? true: false} onChange={(event) => setChecked(event)} />
            <label htmlFor={id.id} className={Styles.label}></label>
        </>)
}

function Option(props: { type: string }) {

    return (<>
        <div>
            <h3>{props.type}</h3>
            {/* toggle switch lies here */}
            <CustomToggleBtn id={props.type} />
        </div>
    </>)
}

function SuggestedUsr(props: {user:chatUser, userStatus: boolean}): JSX.Element {
    return(<div className={Styles.sUsr}>
            <div>
                <div><Image src={Avatar} width={32} height={32} /></div>
                <span>{props.user.firstName + " " + props.user.lastName}</span>
            </div>
            <button className={props.userStatus ? Styles.btnAdd : Styles.btnRmv}>{props.userStatus ? "Add" : "Remove"}</button>
    </div>)
}

function UsrTag(props: {fullname: string, removeTag: any, id: number}) {
    return (
        <div className={Styles.usrTag} id={props.id.toString()}>
            {props.fullname}
            <div onClick={(e) => props.removeTag(props.fullname, e)}><Image src={TagCross} width={6} height={6}/></div>
        </div>
    )
}

const initialUsrState = [{ id: 0, imgSrc: Avatar, firstName: "Youness", lastName: "Santir", status: "Online" },
{ id: 1, imgSrc: Avatar, firstName: "Youness", lastName: "Crew", status: "In Game" },
{ id: 2, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Offline" },];

export function ModalBox(props: { show: boolean, setShow: (Dispatch<SetStateAction<boolean>>), createChannel: any }): JSX.Element {

    const { protectedChannel, channelMode } = useContext(ChatContext) as ChatContextType;
    const [channelName, setChannelName] = useState("");
    const [password, setPassword] = useState("");
    const [showDrpdown, setshowDrpdown] = useState(false);
    const [usrTags, setUsrTags] = useState<Array<string>>([]);
    const [closeUsrs, setCloseUsrs] = useState(initialUsrState);

    function removeTag(fullname:string, e: React.ChangeEvent<HTMLInputElement>, id: string) {
        let i = e.target.parentElement?.parentElement?.parentElement?.id;
        const newUsrTags = usrTags.filter((item) => item !== fullname);
        setUsrTags(newUsrTags);
    }

    function addUsrToChannel(e: React.ChangeEvent<HTMLInputElement>, fullname: string) {
            setshowDrpdown(false);
            setUsrTags([...usrTags, fullname]);
            e.target.value="";
    }

    function filterUsers(e: React.ChangeEvent<HTMLInputElement>) {

        let value = e.target.value.toUpperCase();

        // Return to initial state 
        if (value == "") {
            setCloseUsrs(initialUsrState);
            setshowDrpdown(false);
            return;
        }

        console.log(closeUsrs)

        // Filter out results
        let newUsrs = initialUsrState.filter((usr) => usr.firstName.toUpperCase().startsWith(value) || usr.lastName.toUpperCase().startsWith(value))
        
        setCloseUsrs(newUsrs);
        // Show the dropdown
        value ? setshowDrpdown(true) : setshowDrpdown(false);
    }

    return (
        <>
            {props.show && <><div style={{ display: props.show ? "block" : "none" }} className={Styles.grayBg}>&nbsp;</div>
                <motion.div className={Styles.modalbox} animate={{ scale: 1 }} initial={{ scale: 0.5 }}>
                    <div>
                        <h1>Create channel</h1>
                        <div><Image src={Cross} width={10} height={10} onClick={() => props.setShow(!props.show)} /></div>
                    </div>
                    <div>
                        <span>Channel name</span>
                        <input type="text" onChange={(e) => setChannelName(e.target.value)} />
                    </div>
                    <div>
                        <Option type="Public" />
                        <Option type="Private" />
                        <Option type="Protected" />
                    </div>
                    {(channelMode === "Public") && <p>All users can find and join this channel</p>}
                    {(channelMode === "Private") && <p>Only users you invited can join the channel</p>}
                    {(channelMode === "Protected") && <p>All users can find the channel but only those with the provided password can join</p>}
                    {(protectedChannel && channelMode === "Protected") && <div className={Styles.pwd}>
                        <span>Password</span>
                        <input type="password" onChange={(e) => setPassword(e.target.value)} />
                    </div>}
                    <div>
                        <span>Add Members</span>
                        <div className={Styles.usrsInpt}>
                            {usrTags.map((tag, i) => <UsrTag key={i} fullname={tag} removeTag={removeTag} id={i} />)}
                            {(usrTags.length < 10) && <input type="text" onChange={(e) => filterUsers(e)} />}
                        </div>
                        {showDrpdown && <div className={Styles.dropMembers}>
                            {closeUsrs.map((usr, i) => <SuggestedUsr key={i} user={usr} userStatus={true}/>)}
                        </div>}
                    </div>
                    <button onClick={(e) => props.createChannel(channelName, password, usrTags.length)}>Create</button>
                </motion.div>
            </>}
        </>)
}