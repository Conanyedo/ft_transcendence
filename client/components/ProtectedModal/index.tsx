import Styles from "@styles/chat.module.css"
import { motion } from "framer-motion"
import Image from "next/image"
import Cross from "@public/Cross.svg"
import { useState } from "react"
import { Button } from "@components/Modal"

export const ProtectedFormMdl: React.FC<{convId: string}> = ({convId}) => {

    const [inputVal, setInputVal] = useState("");

    const closePopup = () => {
        // props.setShowSetModal(!props.showSetModal)
    }

    const handleChange = (e: any) => {
        setInputVal(e.target.value);
    }

    const Submit = () => {
        console.log("submitted form", inputVal, '| convID', convId);
    }

    return (<>
        <motion.div className={Styles.modalbox} animate={{ scale: 1 }} initial={{ scale: 0.5 }}>
                <div>
                    <h1 className={Styles.createChnl}>Password</h1>
                    <div><Image src={Cross} width={10} height={10} onClick={closePopup} /></div>
                </div>
                <form className={Styles.form} >
                    <input type="password" onChange={handleChange} className={Styles.usrsInpt}/>
                    <Button clickHandler={Submit} text="Join" />
                </form>
            </motion.div>
    </>)

}
