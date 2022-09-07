import Styles from "@styles/chat.module.css"
import { motion } from "framer-motion"
import Image from "next/image"
import Cross from "@public/Cross.svg"
import { useFormik } from "formik"
import { UsersModalInput } from "@components/Modal/index"
import { useState } from "react"
import Avatar from "@public/profile.jpg"

const Input = (props: { title: string, handleChange: any, value: any, name: string }) => {
    return (<div className={`${Styles.inputContainer}`}>
        <span>{props.title}</span>
        <input name={props.name} type="text" className={Styles.usrsInpt} onChange={props.handleChange} value={props.value} />
    </div>)
}

export const MembersModal = (props: { setShowSetModal: any, showSetModal: any }) => {

    const [users, setUsers] = useState([{ id: 0, imgSrc: Avatar, firstName: "Youness", lastName: "Santir", status: "Online" },
    { id: 1, imgSrc: Avatar, firstName: "Youness", lastName: "Crew", status: "In Game" },
    { id: 2, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Offline" },]);

    const formik = useFormik({
        initialValues: {
            members: [],
            roles: [],
        },
        onSubmit: values => {
            console.log(values);
        },
    });

    const removeUser = () => {
        console.log("remoe user here");
    }

    return (<>
        {props.showSetModal && <><div style={{ display: props.showSetModal ? "block" : "none" }} className={Styles.grayBg}>&nbsp;</div>
            <motion.div className={Styles.modalbox} animate={{ scale: 1 }} initial={{ scale: 0.5 }}>
                <div>
                    <h1 className={Styles.createChnl}>Add Members</h1>
                    <div><Image src={Cross} width={10} height={10} onClick={() => props.setShowSetModal(!props.showSetModal)} /></div>
                </div>
                <form className={Styles.form} onSubmit={formik.handleSubmit}>

                    <Input title="Select Members" name="members" handleChange={formik.handleChange} value={formik.values.members} />

                    <UsersModalInput UsersArray={users} setUsersArray={setUsers} removeUser={removeUser} handleChange={formik.handleChange} value={formik.values.members} />

                    <button type="button">Create</button>
                </form>
            </motion.div></>}

    </>)
}