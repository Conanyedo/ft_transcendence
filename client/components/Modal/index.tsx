import Styles from "@styles/chat.module.css"
import Cross from "@public/Cross.svg"
import Image from "next/image"
import React, { Dispatch, FormEvent, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { ChatContext, ChatContextType } from "@contexts/chatContext"
import { motion } from "framer-motion"
import Avatar from "@public/profile.jpg"
import { Option, SuggestedUsr, UsrTag, addUsrToChannel, removeUsrFromChannel, removeTag, filterUsers, filterOutUsers } from "./utils"
import { chatValidationSchema } from "validation/chatSchemas"
import { chatFormValues } from "@Types/dataTypes"
// Importing formik hooks
import { useFormik } from "formik";
import { useOutsideAlerter } from "customHooks/Functions"
import { getFriends } from "@hooks/useFetchData"

export const UsersModalInput = (props: { addedUsers: any, setAddedUsers: any, removeUser: any, handleChange: any, value: any, inputRef: any, oldUsers: any, setOldUsers: any}) => {

    // console.log(props.addedUsers);

    const removeTagHandler = (e: any, element: any, index: number) => {
        removeTag(
            element,
            e,
            index.toString(),
            props.addedUsers,
            props.setAddedUsers,
            props.oldUsers,
            props.setOldUsers
          )
    }

    useEffect(() => {
        console.log(props.addedUsers);
    }, [props.addedUsers])

    return (<div className={Styles.usrsInpt}>
        {props.addedUsers?.map((element: any, i: number) => <UsrTag key={i} removeTag={removeTagHandler} id={i} fullname={element.fullname}/>)}
        {(props.addedUsers.length < 10) && <input name="member" type="text" onChange={props.handleChange} value={props.value} ref={props.inputRef} />}
    </div>)
}

export function ModalForm(props: { createChannel: any }) {

    // setting local state
    const { protectedChannel, channelMode } = useContext(ChatContext) as ChatContextType;
    const [showDrpdown, setshowDrpdown] = useState(false);
    const [usrTags, setUsrTags] = useState<Array<string>>([]);
    const [friends, setFriends] = useState([]);
    const [addedUsers, setAddedUsers]= useState([]);

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
        },
    });

    useEffect(() => {
        // get list of friends on the first render
        const setUsrs = async () => {
            return await getFriends(setFriends);
        }
        setUsrs();
    }, []);

    const onSubmit = (values: chatFormValues) => {
        alert(JSON.stringify(values, null, 2));
    };

    const handleOnChange = (event: any) => {
        let value = event.target.value;

        formik.setFieldValue("member", value);
        // console.log(formik.values.member);

        filterOutUsers(value, friends, setshowDrpdown);
    };

    const removeUser = () => {
        // console.log("remove user here");
    }

    const clickHandler = (user: any) => {
        addUsrToChannel(user,
            setAddedUsers,
            setshowDrpdown,
            addedUsers,
            inputRef,
            setFriends,
            friends);
            formik.setFieldValue("member", "");
    }

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
                <UsersModalInput addedUsers={addedUsers} setAddedUsers={setAddedUsers} removeUser={removeUser} handleChange={handleOnChange} value={formik.values.member} inputRef={inputRef} />
                {showDrpdown && <div className={Styles.dropMembers}>
                {friends.map((usr: any, i) => {
                            if (usr.fullname.toLowerCase().includes((inputRef?.current?.value)))
                                return <SuggestedUsr key={i} user={usr} action={clickHandler} />
                        })}
                </div>}
            </div>
            <Button clickHandler={(e: any) => props.createChannel(formik.values.cName, channelMode, formik.values.password, addedUsers, setAddedUsers, formik, setErrorMsg)} text="Create"/>
        </form>
        </>
    )
}

export const Button: React.FC<{clickHandler: any, text: string}> = ({clickHandler, text}) => {

    return (<>
        <button type="button" onClick={(e) => clickHandler()} className={Styles.modalBtn}>{text}</button>
    </>)
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