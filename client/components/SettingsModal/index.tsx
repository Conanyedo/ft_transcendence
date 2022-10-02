import Styles from "@styles/chat.module.css"
import { motion } from "framer-motion"
import Image from "next/image"
import Cross from "@public/Cross.svg"
import { useFormik } from "formik"
import { ModalForm, UsersModalInput } from "@components/Modal"
import { EmtyUser, UserTypeNew } from "@Types/dataTypes";
import classes from "@styles/EditProfile.module.css";
import { useState, useRef, useEffect, useContext } from "react"
import UploadIcon from "@public/FriendIcons/UploadIcon.svg";
import { updateUserInfo } from "../../customHooks/useFetchData";
import { Toggle } from "@store/UI-Slice";
import { useAppDispatch } from "@store/hooks";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router"
import { ChatContext, ChatContextType } from "@contexts/chatContext"
import { removeTag, SuggestedUsr, addUsrToChannel, removeUsrFromChannel, filterUsers } from "@components/Modal/utils"
import { Option } from "@components/Modal/utils"

function errorHandler(formData: any) {
    console.log(formData);
}

function updateChannel(values: any, usrTags: Array<string>, setUsrTags: any, setErrorMsg: any, data: any) {
    let formData = {...values , ...data};
    console.log(data);
    errorHandler(formData);
}

const Form = ({data}: any) => {
    const { protectedChannel, channelMode } = useContext(ChatContext) as ChatContextType;
    const [showDrpdown, setshowDrpdown] = useState(false);
    const [usrTags, setUsrTags] = useState<Array<string>>([]);
    const [friends, setFriends] = useState([]);
    const [closeUsrs, setCloseUsrs] = useState(friends);
    const [initialUsrState, setInitialUsrState] = useState([]);

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

    const inputRef = useRef("");

    const [errorMsg, setErrorMsg] = useState("");

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
            <button type="button" onClick={(e) => updateChannel(formik.values, usrTags, setUsrTags, setErrorMsg, data)}>Update</button>
        </form></>)
}

const ImageUploader = (props: { setImgSrc: any, ImageRef: any, avatar: any, setAvatar: any }) => {

    const nameRef = useRef<any>(null);
    const token = getCookie("jwt");
    const avatarRef = useRef<any>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const toggleHandler = async (e: any) => {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function () {
            props.ImageRef.current.src = reader.result;
            props.setAvatar(reader.result);
            props.setImgSrc(reader.result)
        };

        reader.readAsDataURL(file);
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

    const formik = useFormik({
        initialValues: {
            cName: "",
            roles: [],
        },
        onSubmit: values => {
            console.log(values);
        },
    });

    // setting image ref here
    const ImageRef = useRef<any>(null);

    useEffect(() => {
        console.log("previous old path is", oldPath);
        console.log("imgsrc is", imgSrc);
        setAvatar(props.data?.avatar);
        setOldPath(props.data?.avatar);

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
                <Form data={updateData} />
            </motion.div>)} </>
    </>)
}

function dispatch(arg0: { payload: undefined; type: string }) {
    throw new Error("Function not implemented.")
}
