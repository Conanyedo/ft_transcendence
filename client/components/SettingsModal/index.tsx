import Styles from "@styles/chat.module.css"
import { motion } from "framer-motion"
import Image from "next/image"
import Cross from "@public/Cross.svg"
import { useFormik } from "formik"


const Input = (props: { title: string, handleChange: any, value: any, name: string }) => {
    return (<div className={`${Styles.inputContainer}`}>
        <span>{props.title}</span>
        <input name={props.name} type="text" className={Styles.usrsInpt} onChange={props.handleChange} value={props.value} />
    </div>)
}

export const SettingsModal = (props: { setShowSetModal: any, showSetModal: any }) => {

    const formik = useFormik({
        initialValues: {
            members: [],
            roles: [],
        },
        onSubmit: values => {
            console.log(values);
        },
    });

    return (<>
        {props.showSetModal && <><div style={{ display: props.showSetModal ? "block" : "none" }} className={Styles.grayBg}>&nbsp;</div> 
        <motion.div className={Styles.modalbox} animate={{ scale: 1 }} initial={{ scale: 0.5 }}>
            <div>
                <h1 className={Styles.createChnl}>Add Members</h1>
                <div><Image src={Cross} width={10} height={10} onClick={() => props.setShowSetModal(!props.showSetModal)} /></div>
            </div>
            <form className={Styles.form} onSubmit={formik.handleSubmit}>

                <Input title="Select Members" name="members" handleChange={formik.handleChange} value={formik.values.members} />
                <Input title="Select Role" name="roles" handleChange={formik.handleChange} value={formik.values.roles} />

                <button type="button">Create</button>
            </form>
        </motion.div></>}

    </>)
}