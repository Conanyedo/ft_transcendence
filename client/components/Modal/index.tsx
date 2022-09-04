import Styles from "@styles/chat.module.css"
import Cross from "@public/Cross.svg"
import Image from "next/image"
import React, { Dispatch, SetStateAction, useContext, useState } from "react"
import { ChatContext, ChatContextType } from "@contexts/chatContext"
import { motion } from "framer-motion"
import Avatar from "@public/profile.jpg"
import { Option, SuggestedUsr, UsrTag, addUsrToChannel, removeUsrFromChannel, removeTag } from "./utils"
import { chatValidationSchema } from "validation/chatSchemas"
import { Formik, Form, Field, ErrorMessage } from "formik";

const initialUsrState = [{ id: 0, imgSrc: Avatar, firstName: "Youness", lastName: "Santir", status: "Online" },
{ id: 1, imgSrc: Avatar, firstName: "Youness", lastName: "Crew", status: "In Game" },
{ id: 2, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Offline" },];

interface chatFormValues {
    cName: string,
    password: string,
    members: Array<string>
}

export function ModalBox(props: { show: boolean, setShow: (Dispatch<SetStateAction<boolean>>), createChannel: any }): JSX.Element {

    const { protectedChannel, channelMode } = useContext(ChatContext) as ChatContextType;
    const [channelName, setChannelName] = useState("");
    const [password, setPassword] = useState("");
    const [showDrpdown, setshowDrpdown] = useState(false);
    const [usrTags, setUsrTags] = useState<Array<string>>([]);
    const [closeUsrs, setCloseUsrs] = useState(initialUsrState);

    // Set the form validation using Yup && formik

    const initialValues = {
        cName: "",
        password: "",
        members: []
    }

    const onSubmit = (values: chatFormValues) => {
        alert(JSON.stringify(values, null, 2));
    };

    const renderError = (message: string) => <p className={Styles.errorMsg}>{message}</p>;

    return (
        <>
            <Formik initialValues={initialValues} validationSchema={chatValidationSchema} onSubmit={async (values, { resetForm }) => {
                await onSubmit(values);
                resetForm();
            }}>
                <Form>
                    {props.show && <><div style={{ display: props.show ? "block" : "none" }} className={Styles.grayBg}>&nbsp;</div>
                        <motion.div className={Styles.modalbox} animate={{ scale: 1 }} initial={{ scale: 0.5 }}>
                            <div>
                                <h1>Create channel</h1>
                                <div><Image src={Cross} width={10} height={10} onClick={() => props.setShow(!props.show)} /></div>
                            </div>
                            <div>
                                <span>Channel name</span>
                                <Field name="cName" type="text" />
                                <ErrorMessage name="name" render={renderError} />
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
                                <Field name="password" type="password" />
                                <ErrorMessage name="name" render={renderError} />
                            </div>}
                            <div>
                                <span>Add Members</span>
                                <div className={Styles.usrsInpt}>
                                    {usrTags.map((tag, i) => <UsrTag key={i} fullname={tag} removeTag={removeTag} id={i} />)}
                                    {(usrTags.length < 10) && <Field name="member" type="text" />}
                                </div>
                                {showDrpdown && <div className={Styles.dropMembers}>
                                    {closeUsrs.map((usr, i) => <SuggestedUsr key={i} user={usr} userStatus={true} addUsrToChannel={addUsrToChannel} removeUsrFromChannel={removeUsrFromChannel} />)}
                                </div>}
                            </div>
                            <button onClick={(e) => props.createChannel(channelName, password, usrTags.length)}>Create</button>
                        </motion.div>
                    </>}</Form></Formik>
        </>)
}

// Form stuff
// const inputInitialValues = {input1: "", input2: "", input3: ""};
// const [input_values, set_input_values] = useState(inputInitialValues);


// function clearInputValues() {
    //     set_input_values(inputInitialValues);
// }

// function inputs_handler(e: React.ChangeEvent<HTMLInputElement>) {
    //     let name = e.target.name;
//     let value = e.target.value;

//     if (name == "input3") {
    //         filterUsers(value);
//     }

//     set_input_values({ ...input_values, [name]: value });
// }