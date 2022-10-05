import Styles from "@styles/chat.module.css"
import { motion } from "framer-motion"
import Image from "next/image"
import Cross from "@public/Cross.svg"
import { useFormik } from "formik"
import { Button, UsersModalInput } from "@components/Modal/index"
import { useEffect, useRef, useState } from "react"
import Avatar from "@public/profile.jpg"
import { filterUsers, SuggestedUsr, addUsrToChannel, removeUsrFromChannel, filterOutUsers, } from "@components/Modal/utils"
import { addMembers, getFriends } from "@hooks/useFetchData"

const Input = (props: { title: string, handleChange: any, value: any, name: string }) => {
    return (<div className={`${Styles.inputContainer}`}>
        <span>{props.title}</span>
        <input name={props.name} type="text" className={Styles.usrsInpt} onChange={props.handleChange} value={props.value} />
    </div>)
}

export const MembersModal = (props: { setShowSetModal: any, showSetModal: any, convId: any }) => {

    const [initialUsrState, setInitialUsrState] = useState([]);
    const [showDrpdown, setshowDrpdown] = useState(false);

    // new logic
    const [friends, setFriends] = useState([]);
    const [addedUsers, setAddedUsers]= useState([]);

    const inputRef= useRef("");

    const formik = useFormik({
        initialValues: {
            member: "",
        },
        onSubmit: values => {
            // console.log(values);
        },
    });

    const removeUser = () => {
        // console.log("remove user here");
    }

    const handleOnChange = (event: any) => {
        let value = event.target.value;
        formik.setFieldValue("member", value);
        // Filter values here
        filterOutUsers(value, friends, setshowDrpdown);
    };

    useEffect(() => {
        // get list of friends on the first render
        const setUsrs = async () => {
            return await getFriends(setFriends);
        }
        setUsrs();
    }, []);

    const addMember = () => {
        props.setShowSetModal(false);
        formik.setFieldValue("member", "");
        let logins = addedUsers.map((user: any) => user.login);
        const data = { convId: props.convId, members: logins};
        // // call the route to add the user here
        addMembers(data);
        setAddedUsers([]);
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
        {props.showSetModal && <><div style={{ display: props.showSetModal ? "block" : "none" }} className={Styles.grayBg}>&nbsp;</div>
            <motion.div className={Styles.modalbox} animate={{ scale: 1 }} initial={{ scale: 0.5 }}>
                <div>
                    <h1 className={Styles.createChnl}>Add Members</h1>
                    <div><Image src={Cross} width={10} height={10} onClick={() => props.setShowSetModal(!props.showSetModal)} /></div>
                </div>
                <form className={Styles.form} onSubmit={formik.handleSubmit}>

                    <UsersModalInput addedUsers={addedUsers} setAddedUsers={setAddedUsers} removeUser={removeUser} handleChange={handleOnChange} value={formik.values.member} inputRef={inputRef} />
                    {showDrpdown && <div className={Styles.dropMembers}>
                        {friends.map((usr: any, i) => {
                            if (usr.fullname.toLowerCase().includes((inputRef?.current?.value)))
                                return <SuggestedUsr key={i} user={usr} action={clickHandler} />
                        })}
                    </div>}
                    <Button clickHandler={addMember} text="Add"/>
                </form>
            </motion.div></>}

    </>)
}