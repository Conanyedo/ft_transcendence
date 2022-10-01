import Styles from "@styles/chat.module.css"
import Cross from "@public/Cross.svg"
import Image from "next/image"
import React, { Dispatch, FormEvent, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { ChatContext, ChatContextType } from "@contexts/chatContext"
import { motion } from "framer-motion"
import Avatar from "@public/profile.jpg"
import { Option, SuggestedUsr, UsrTag, addUsrToChannel, removeUsrFromChannel, removeTag, filterUsers } from "./utils"
import { chatValidationSchema } from "validation/chatSchemas"
import { chatFormValues } from "@Types/dataTypes"

// Importing formik hooks
import { setIn, useFormik } from "formik";
import { useOutsideAlerter } from "customHooks/Functions"
import { getFriends } from "@hooks/useFetchData"


export const UsersModalInput = (props: { UsersArray: any, setUsersArray: any, removeUser: any, handleChange: any, value: any, inputRef: any}) => {

    const userTagsItems = props.UsersArray;

    return (<div className={Styles.usrsInpt}>
        {userTagsItems.map((element: any, i: number) => <UsrTag key={i} fullname={element} removeTag={removeTag} id={i} usrTags={props.UsersArray} setUsrTags={props.setUsersArray} />)}
        {(props.UsersArray.length < 10) && <input name="member" type="text" onChange={props.handleChange} value={props.value} ref={props.inputRef} />}
    </div>)
}

export function ModalForm(props: { createChannel: any }) {

    // setting local state
    const { protectedChannel, channelMode } = useContext(ChatContext) as ChatContextType;
    const [showDrpdown, setshowDrpdown] = useState(false);
    const [usrTags, setUsrTags] = useState<Array<string>>([]);
    const [friends, setFriends] = useState([]);
    const [closeUsrs, setCloseUsrs] = useState(friends);
    const [initialUsrState, setInitialUsrState] = useState([]);

    const [errorMsg, setErrorMsg] = useState("");

    const inputRef = useRef("");
    // Set the form validation using Yup && formik
    const formik = useFormik({
        initialValues: {
            cName: "",
            password: "",
            member: ""
        },
        onSubmit: values => {
            console.log(values);
        },
    });

    useEffect(() => {

        console.log("it keeps re rendering");
        // get list of friends on the first render
        const setUsrs = async () => {
            return await getFriends(setCloseUsrs, setInitialUsrState);
        }
        setUsrs();
    }, []);

    // useEffect(() => {
    //     console.log("close usrs", closeUsrs);
    //     if (closeUsrs.length !== 0)
    //         setshowDrpdown(true);
    // }, [closeUsrs]);

    const onSubmit = (values: chatFormValues) => {
        alert(JSON.stringify(values, null, 2));
    };

    const handleOnChange = (event: any) => {
        let value = event.target.value;

        formik.setFieldValue("member", value);
        console.log(formik.values.member);

        // Filter values here
        filterUsers(value, setCloseUsrs, setshowDrpdown, initialUsrState, setUsrTags);
    };

    return (<>
        {errorMsg !== "" && <span className={Styles.error}>{errorMsg}</span>}
        <form className={Styles.form} onSubmit={formik.handleSubmit}>
            <div className={Styles.inputContainer}>
                <span>Channel name</span>
                <input name="cName" type="text" className={Styles.usrsInpt} onChange={formik.handleChange} value={formik.values.cName} />
                {/* <ErrorMessage name="cName" render={() => renderError("Channel names should contain between 3 & 15 characters.")} /> */}
            </div>
            <div className={Styles.options}>
                <Option type="Public" />
                <Option type="Private" />
                <Option type="Protected" />
            </div>

            {(channelMode === "Public") && <p>All users can find and join this channel</p>}
            {(channelMode === "Private") && <p>Only users you invited can join the channel</p>}
            {(channelMode === "Protected") && <p>All users can find the channel but only those with the provided password can join</p>}
            {(protectedChannel && channelMode === "Protected") && <div className={Styles.inputContainer}>
                <span>Password</span>
                <input name="password" type="password" className={Styles.usrsInpt} onChange={formik.handleChange} value={formik.values.password} />
                {/* <ErrorMessage name="password" render={() => renderError("Passwords should contain between 8 & 15 characters.")} /> */}
            </div>}
            <div className={Styles.inputContainer + " " + Styles.mTop}>
                <span>Add Members</span>
                <UsersModalInput UsersArray={usrTags} setUsersArray={setUsrTags} removeUser={removeTag} handleChange={handleOnChange} value={formik.values.member} inputRef={inputRef} />
                {showDrpdown && <div className={Styles.dropMembers}>
                    {closeUsrs.map((usr, i) => <SuggestedUsr key={i} user={usr} userStatus={true} addUsrToChannel={addUsrToChannel} removeUsrFromChannel={removeUsrFromChannel} setUsrTags={setUsrTags} setshowDropdown={setshowDrpdown} usrTags={usrTags} setValue={formik.setFieldValue} inputRef={inputRef} initialUsrState={initialUsrState} setInitialUsrState={setInitialUsrState} />)}
                </div>}
            </div>
            <button type="button" onClick={(e) => props.createChannel(formik.values.cName, channelMode, formik.values.password, usrTags, setUsrTags, formik, setErrorMsg)}>Create</button>
        </form>
        </>
    )
}

export function ModalBox(props: { show: boolean, setShow: (Dispatch<SetStateAction<boolean>>), createChannel: any }): JSX.Element {

    const modalRef = useRef(null);

    // set add and remove user from channel
    useOutsideAlerter(modalRef, props.setShow);
    return (
        <>
            {props.show && <><div style={{ display: props.show ? "block" : "none" }} className={Styles.grayBg}>&nbsp;</div>
                <motion.div ref={modalRef} className={Styles.modalbox} animate={{ scale: 1 }} initial={{ scale: 0.5 }}>
                    <div>
                        <h1 className={Styles.createChnl}>Create channel</h1>
                        <div><Image src={Cross} width={10} height={10} onClick={() => props.setShow(!props.show)} /></div>
                    </div>
                    <ModalForm createChannel={props.createChannel} />
                </motion.div>
            </>}
        </>)
}

// Let's delete this later
{/* Put the users choose input here */ }
{/* <div className={Styles.usrsInpt}>
        {usrTags.map((tag, i) => <UsrTag key={i} fullname={tag} removeTag={removeTag} id={i} usrTags={usrTags} setUsrTags={setUsrTags} />)}
        {(usrTags.length < 10) && <input name="member" type="text" onChange={handleOnChange} value={formik.values.member} />}
</div> */}

// Method: "POST"

// @IsNotEmpty()
// name: string;

// @IsNotEmpty()
// type: convType;

// @IsNotEmpty()
// members: string[];

// @IsNotEmpty()
// password: string;

// export enum memberStatus {
// 	OWNER = "Owner",
// 	ADMIN = "Admin",
// 	MEMBER = "Member",
// }

// export enum convType {
// 	DM = "Dm",
// 	PUBLIC = "Public",
// 	PROTECTED = "Protected",
// 	PRIVATE = "Private",
// }
