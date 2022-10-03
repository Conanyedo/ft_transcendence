import Styles from "@styles/chat.module.css"
import { motion } from "framer-motion"
import Image from "next/image"
import Cross from "@public/Cross.svg"
import { useFormik } from "formik"
import { UsersModalInput } from "@components/Modal/index"
import { useEffect, useRef, useState } from "react"
import Avatar from "@public/profile.jpg"
import { filterUsers, SuggestedUsr, addUsrToChannel, removeUsrFromChannel, } from "@components/Modal/utils"
import { addMembers, getFriends } from "@hooks/useFetchData"

const Input = (props: { title: string, handleChange: any, value: any, name: string }) => {
    return (<div className={`${Styles.inputContainer}`}>
        <span>{props.title}</span>
        <input name={props.name} type="text" className={Styles.usrsInpt} onChange={props.handleChange} value={props.value} />
    </div>)
}

export const MembersModal = (props: { setShowSetModal: any, showSetModal: any, convId: any }) => {

    const [initialUsrState, setInitialUsrState] = useState([]);
    const [users, setUsers] = useState(initialUsrState);
    const [showDrpdown, setshowDrpdown] = useState(false);
    const [usrTags, setUsrTags] = useState<Array<string>>([]);
    const [logins, setUsrLogins] = useState<Array<string>>([]);

    const inputRef= useRef("");

    const formik = useFormik({
        initialValues: {
            member: "",
        },
        onSubmit: values => {
            console.log(values);
        },
    });

    const removeUser = () => {
        // console.log("remove user here");
    }

    const handleOnChange = (event: any) => {
        let value = event.target.value;
        formik.setFieldValue("member", value);
        // Filter values here
        filterUsers(value, setUsers, setshowDrpdown, initialUsrState, setUsrTags);
    };

    useEffect(() => {
        // get list of friends on the first render
        const setUsrs = async () => {
            return await getFriends(setUsers, setInitialUsrState);
        }
        setUsrs();
    }, []);

    const addMember = () => {
        props.setShowSetModal(false);
        // console.log("Member added");

        formik.setFieldValue("member", "");
        setUsrTags([]);
        let logins = users.map((item: any) => item?.login);
        const data = { convId: props.convId, members: logins};
        // call the route to add the user here
        addMembers(data);
    }

    return (<>
        {props.showSetModal && <><div style={{ display: props.showSetModal ? "block" : "none" }} className={Styles.grayBg}>&nbsp;</div>
            <motion.div className={Styles.modalbox} animate={{ scale: 1 }} initial={{ scale: 0.5 }}>
                <div>
                    <h1 className={Styles.createChnl}>Add Members</h1>
                    <div><Image src={Cross} width={10} height={10} onClick={() => props.setShowSetModal(!props.showSetModal)} /></div>
                </div>
                <form className={Styles.form} onSubmit={formik.handleSubmit}>

                    <UsersModalInput UsersArray={usrTags} setUsersArray={setUsrTags} removeUser={removeUser} handleChange={handleOnChange} value={formik.values.member} inputRef={inputRef} />
                    {showDrpdown && <div className={Styles.dropMembers}>
                        {users.map((usr, i) => <SuggestedUsr key={i} user={usr} userStatus={true} addUsrToChannel={addUsrToChannel} removeUsrFromChannel={removeUsrFromChannel} setUsrTags={setUsrTags} setshowDropdown={setshowDrpdown} usrTags={usrTags} setValue={formik.setFieldValue} inputRef={inputRef} initialUsrState={initialUsrState} setInitialUsrState={setInitialUsrState} />)}
                    </div>}
                    <button type="button" onClick={addMember}>Add</button>
                </form>
            </motion.div></>}

    </>)
}