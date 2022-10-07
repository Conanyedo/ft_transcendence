import Styles from "@styles/chat.module.css"
import { motion } from "framer-motion"
import Image from "next/image"
import Cross from "@public/Cross.svg"
import { useFormik } from "formik"
import classes from "@styles/EditProfile.module.css";
import { useState, useRef, useEffect, useContext } from "react"
import UploadIcon from "@public/FriendIcons/UploadIcon.svg";
import { updateChnlInfo } from "../../customHooks/useFetchData";
import { useRouter } from "next/router"
import { ChatContext, ChatContextType } from "@contexts/chatContext"
import { Option } from "@components/Modal/utils"
import { getImageBySize } from "@hooks/Functions"

function errorHandler(values: any, data: any) {
    return (values.cName.length == 0 || data.oldPath == "" || !data.avatar)
}

function updateChannel(values: any, data: any, currUser: any, router: any, setshowModal: any, setErrorMsg: any) {

    if (!errorHandler(values, data)) {
        const formData = new FormData();
        formData.append('convId', currUser.convId);
        formData.append('name', values.cName);
        formData.append('type', values.type);
        formData.append('password', values.password);
        formData.append('avatar', data.avatar);
        formData.append('oldPath', data.oldPath);
        updateChnlInfo(formData, router, values.cName);
        setshowModal(false);
    } else {
        setErrorMsg("Please provide the necessary input values.");
    }
    
}

const Form = ({ data, currUser, setShowSetModal }: any) => {
    const { protectedChannel, channelMode } = useContext(ChatContext) as ChatContextType;

    // Set the form validation using Yup && formik
    const formik = useFormik({
        initialValues: {
            cName: "",
            type: channelMode,
            password: "",
        },
        onSubmit: values => {
        },
    });

    const router = useRouter();

    useEffect(() => {
        formik.setFieldValue("type", channelMode);
    }, [channelMode])

    const [errorMsg, setErrorMsg] = useState("");
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
            </div>}
            <button type="button" onClick={(e) => updateChannel(formik.values, data, currUser, router, setShowSetModal, setErrorMsg)}>Update</button>
        </form></>)
}

const ImageUploader = (props: { setImgSrc: any, ImageRef: any, avatar: any, setAvatar: any }) => {
    const avatarRef = useRef<any>(null);

    const toggleHandler = async (e: any) => {
        var file = e.target.files[0];
        var reader = new FileReader();
        props.setImgSrc(file);
        reader.readAsDataURL(file);
        reader.onload = function () {
            props.ImageRef.current.src = reader.result;
            props.setAvatar(reader.result);
        };
    };

    return (<div className={classes.avatar}>
        <img src={props.avatar} ref={avatarRef} />
        <input
            type="file"
            className={`${classes.toggle} ${classes.inputHide}`}
            ref={props.ImageRef}
            accept='.png, .jpg, .jpeg'
            onChange={toggleHandler}
        />
        <div className={`${classes.toggle}`}>
            <Image src={UploadIcon} width="120%" height="120%" />
        </div>
    </div>)
}

export const SettingsModal = (props: { setShowSetModal: any, showSetModal: any, data: any }) => {

    const [imgSrc, setImgSrc] = useState("");
    const [oldPath, setOldPath] = useState("");
    const [avatar, setAvatar] = useState<any>();
    const [updateData, setUpdateData] = useState({});

    // setting image ref here
    const ImageRef = useRef<any>(null);

    useEffect(() => {
        setAvatar(getImageBySize(props.data?.avatar, 70));
        setOldPath(getImageBySize(props.data?.avatar, 70));

        // the data should be as follows {name, type, password, avatar, oldPath}
        setUpdateData({ avatar: imgSrc, oldPath: oldPath });
    }, [imgSrc, oldPath, props.data]);

    return (<>
        <><div style={{ display: props.showSetModal ? "block" : "none" }} className={Styles.grayBg}>&nbsp;</div>
            {props.showSetModal && (<motion.div className={Styles.modalbox} animate={{ scale: 1 }} initial={{ scale: 0.5 }}>
                <div>
                    <h1 className={Styles.createChnl}>Channel Settings</h1>
                    <div><Image src={Cross} width={10} height={10} onClick={() => props.setShowSetModal(!props.showSetModal)} /></div>
                </div>
                <div className={Styles.flexCenter}>
                    <ImageUploader setImgSrc={setImgSrc} ImageRef={ImageRef} avatar={avatar} setAvatar={setAvatar} />
                </div>
                <Form data={updateData} currUser={props.data} setShowSetModal={props.setShowSetModal} />
            </motion.div>)} </>
    </>)
}
