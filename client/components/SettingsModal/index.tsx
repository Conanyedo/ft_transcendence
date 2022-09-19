import Styles from "@styles/chat.module.css"
import { motion } from "framer-motion"
import Image from "next/image"
import Cross from "@public/Cross.svg"
import { useFormik } from "formik"
import { ModalForm } from "@components/Modal"
import { EmtyUser, UserTypeNew } from "@Types/dataTypes";
import classes from "@styles/EditProfile.module.css";
import { useState, useRef } from "react"
import UploadIcon from "@public/FriendIcons/UploadIcon.svg";
import { updateUserInfo } from "../../customHooks/useFetchData";
import { Toggle } from "@store/UI-Slice";
import { useAppDispatch } from "@store/hooks";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router"

const OldData = {
    name: '',
    image: ''
}

const ImageUploader = () => {

    const [avatar, setAvatar] = useState<any>("");
    const ImageRef = useRef<any>(null);
    const nameRef = useRef<any>(null);
    const token = getCookie("jwt");
    const avatarRef = useRef<any>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const toggleHandler = async (e: any) => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function () {
            ImageRef.current.src = reader.result;
            setAvatar(reader.result);
        };

        reader.readAsDataURL(file);
    };

    return (<div className={classes.avatar}>
        <img src={avatar} ref={avatarRef} />
        <input
            type="file"
            className={`${classes.toggle} ${classes.inputHide}`}
            ref={ImageRef}
            accept='.png, .jpg, .jpeg'
            onChange={toggleHandler}
        />
        <div className={`${classes.toggle}`}>
            <Image src={UploadIcon} width="120%" height="120%" />
        </div>
    </div>)
}

export const SettingsModal = (props: { setShowSetModal: any, showSetModal: any }) => {

    const formik = useFormik({
        initialValues: {
            cName: "",
            roles: [],
        },
        onSubmit: values => {
            console.log(values);
        },
    });

    const debugCloseBtn = () => {
        console.log("debug here");
        props.setShowSetModal(!props.showSetModal);
    }

    return (<>
        <><div style={{ display: props.showSetModal ? "block" : "none" }} className={Styles.grayBg}>&nbsp;</div>
            {props.showSetModal && (<motion.div className={Styles.modalbox} animate={{ scale: 1 }} initial={{ scale: 0.5 }}>
                <div>
                    <h1 className={Styles.createChnl}>Channel Settings</h1>
                    <div><Image src={Cross} width={10} height={10} onClick={() => props.setShowSetModal(!props.showSetModal)} /></div>
                </div>
                <div className={Styles.flexCenter}>
                    <ImageUploader />
                </div>
                <ModalForm createChannel={() => props.setShowSetModal(false)} />
            </motion.div>)} </>
    </>)
}

function dispatch(arg0: { payload: undefined; type: string }) {
    throw new Error("Function not implemented.")
}
