import Styles from "@styles/chat.module.css"
import Cross from "@public/Cross.svg"
import Image from "next/image"
import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { ChatContext, ChatContextType } from "@contexts/chatContext"
import { motion } from "framer-motion"
import Avatar from "@public/profile.jpg"
import { Option, SuggestedUsr, UsrTag, addUsrToChannel, removeTag, filterOutUsers } from "./utils"
import { chatValidationSchema } from "validation/chatSchemas"
import { chatFormValues } from "@Types/dataTypes"
// Importing formik hooks
import { useFormik } from "formik";
import { useOutsideAlerter } from "customHooks/Functions"
import { getFriends } from "@hooks/useFetchData"

export const UsersModalInput = (props: { addedUsers: any, setAddedUsers: any, handleChange: any, value: any, inputRef: any, oldUsers: any, setOldUsers: any}) => {

    const removeTagHandler = (element: any) => {
        removeTag(
            element,
            props.addedUsers,
            props.setAddedUsers
          )
    }

    useEffect(() => {
    }, [props.addedUsers])

    return (<div className={Styles.usrsInpt}>
        {props.addedUsers?.map((element: any, i: number) => <UsrTag key={i} removeTag={() => removeTagHandler(element)} id={i} fullname={element.fullname}/>)}
        {(props.addedUsers.length < 10) && <input name="member" type="text" onChange={props.handleChange} value={props.value} ref={props.inputRef} />}
    </div>)
}

export function ModalForm(props: { createChannel: any }) {

    // setting local state
    const { protectedChannel, channelMode, lastUsers } = useContext(ChatContext) as ChatContextType;
    const [showDrpdown, setshowDrpdown] = useState(false);
    const [friends, setFriends] = useState([]);
    const [addedUsers, setAddedUsers]= useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [mount, setMount] = useState(false);

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
        setMount(true);
        setUsrs();

        return () => setMount(false);
    }, []);

    const onSubmit = (values: chatFormValues) => {
        alert(JSON.stringify(values, null, 2));
    };
    

    const handleOnChange = (event: any) => {
        let value = event.target.value;

        formik.setFieldValue("member", value);
        setErrorMsg("");

        filterOutUsers(value, friends, setshowDrpdown);
    };

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
    const elm = inputRef?.current as React.InputHTMLAttributes<HTMLInputElement>;
    return ( <>
        {mount && <>{errorMsg !== "" && <span className={Styles.error}>{errorMsg}</span>}
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
                <UsersModalInput addedUsers={addedUsers} setAddedUsers={setAddedUsers} handleChange={handleOnChange} value={formik.values.member} inputRef={inputRef} oldUsers={friends} setOldUsers={setFriends} />
                {showDrpdown && <div className={Styles.dropMembers}>
                {friends.filter(item => !addedUsers.includes(item)).map((usr: any, i) => {
                            if (usr.fullname.toLowerCase().includes((elm?.value)))
                                return <SuggestedUsr key={i} user={usr} action={clickHandler} />
                        })}
                </div>}
            </div>
            <Button clickHandler={(e: any) => props.createChannel(formik.values.cName, channelMode, formik.values.password, addedUsers, setAddedUsers, formik, errorMsg, setErrorMsg)} text="Create"/>
        </form></>}
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
    const [mount, setMount] = useState(false);

    useEffect(() => {
        setMount(true);

        return () => setMount(false);
    }, [])

    // set add and remove user from channel
    useOutsideAlerter(modalRef, props.setShow);
    return (
        <>
            {props.show && mount && <><div style={{ display: props.show ? "block" : "none" }} className={Styles.grayBg}>&nbsp;</div>
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